---
title: "Deep War is coming"
summary: "A first look at Deep War (غارق في الحرب), an offline procedural tactical shooter in Godot 4.7.2 from 5A1F Studio. In development — no release date yet."
date: "2026-11-21"
tags: ["games", "devlog", "godot"]
cover: "cover.png"
---

# Deep War is coming

Today we are opening the notebook on **Deep War** — **غارق في الحرب** — a new game
from the games track at 5A1F Studio. It is being built by **Amin** and **Emad**
in **Godot 4.7.2**. This is a coming-soon note, not a launch: the project is in
active development and there is no release date yet.

## The idea

Deep War is an offline, seed-driven 3D tactical shooter. You drop into a world
assembled from procedural tiles, fight through AI enemies, build a weapon from
what you find, and choose how you want to leave the map. Everything runs locally;
there is no account, no server and no network requirement.

## What is already in the project

- **Procedural worlds.** A socket-based tile solver assembles 50 × 50 metre
  pieces into 12 × 12 or 8 × 8 worlds. Rivers stay connected and flat edges meet
  cleanly, so each seed produces a coherent map.
- **Three ways to play.** Mini Battle Royale, Extraction and Infinity each use
  the same world and combat systems differently.
- **A tactical player.** FPS/TPS, aiming down sights, walk, sprint, crouch, prone,
  slide, vault, swim and lean, plus five upgradeable Skill Chips.
- **Weapons with a life of their own.** Six archetypes, four rarities, rolled
  stats and six traits, assembled on a modular 3D rig and fused at a bench.
- **Enemies that react.** Grunt, Sniper, Heavy and Drone types run a tactical
  state machine, and Bot Factory cores can be destroyed.
- **Bilingual by design.** Instant Arabic RTL and English LTR with full layout
  mirroring, not just translated strings.
- **PC and mobile.** Keyboard/mouse and a touch layout with joystick, dual fire
  buttons, gesture look, optional gyroscope and a draggable HUD editor.
- **Procedural audio.** Waveforms are synthesised at runtime, so the project
  carries no audio files.

## An honest status

This is early work. The systems are in place and the project opens in Godot, but
it is not a finished game. There is no store page, no download and no date. We
are sharing the direction now because the studio's work should be visible while
it is being made, not only after it is polished.

## Where to follow it

The source is public at
[github.com/official5a1fstudio/deep-war](https://github.com/official5a1fstudio/deep-war).
The rest of the studio's work is at
[5a1f.vercel.app](https://5a1f.vercel.app).

If you open the project in Godot and find a rough edge, open an issue on the
repository. That is more useful to us than silence.
