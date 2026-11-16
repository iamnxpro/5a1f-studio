import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@fontsource-variable/inter";
import "@fontsource/dm-serif-display/latin-400.css";
import "@fontsource/orbitron/latin-500.css";
import "@fontsource/orbitron/latin-700.css";

/* Self-hosted Arabic pair: Amiri (editorial serif) + IBM Plex Sans Arabic. */
import "@fontsource/amiri/arabic.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-400.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-500.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-600.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-700.css";

import "@/styles/global.css";

import App from "@/App";
import { AudioProvider } from "@/contexts/AudioContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { MotionProvider } from "@/contexts/MotionContext";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element #root was not found in index.html");
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <MotionProvider>
          <AudioProvider>
            <App />
          </AudioProvider>
        </MotionProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);
