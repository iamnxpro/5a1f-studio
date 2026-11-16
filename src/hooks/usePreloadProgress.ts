import { useEffect, useState } from "react";
import { mediaUrl, site } from "@/lib/contentLoader";

type PreloadState = {
  progress: number;
  ready: boolean;
};

function loadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = url;
  });
}

function loadFont(descriptor: string): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return Promise.resolve();
  return document.fonts
    .load(descriptor)
    .then(() => undefined)
    .catch(() => undefined);
}

/**
 * Real asset progress: the visible brand mark is decoded and the self-hosted
 * fonts are loaded. Below-the-fold images are intentionally left to the
 * browser so a slow connection cannot hold the preloader at 99%.
 */
export function usePreloadProgress(): PreloadState {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const assetPaths = [site.logo];

    const urls = new Set<string>();
    for (const path of assetPaths) {
      const resolved = mediaUrl(path);
      if (resolved) urls.add(resolved);
    }

    const tasks: Array<Promise<void>> = [
      ...[...urls].map((url) => loadImage(url)),
      loadFont('400 16px "Inter Variable"'),
      loadFont('700 16px "Orbitron"'),
      loadFont('400 16px "DM Serif Display"'),
      loadFont('400 16px "IBM Plex Sans Arabic"'),
      loadFont('700 16px "Amiri"'),
      document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve(),
    ];

    let completed = 0;
    setProgress(0);
    setReady(false);

    for (const task of tasks) {
      void task.finally(() => {
        if (cancelled) return;
        completed += 1;
        setProgress(Math.round((completed / tasks.length) * 100));
        if (completed === tasks.length) setReady(true);
      });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return { progress, ready };
}
