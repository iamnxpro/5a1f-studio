---
title: "Introducing Mawthooq: your keys, on your device"
summary: "Amin and Emad built Mawthooq, a local password vault and TOTP authenticator in Rust. The first release is here and development is ongoing."
date: "2026-11-21"
tags: ["software", "release", "security"]
cover: "cover.svg"
---

# Introducing موثوق (Mawthooq)

Today we are sharing the first release of **Mawthooq** — موثوق in Arabic — a local
password manager and TOTP authenticator built by **Amin** and **Emad** here at
5A1F Studio. It is written in Rust, version **v0.1.0** is available to download,
and the app is in active development.

## What Mawthooq does

- **A vault that lives locally.** Mawthooq keeps your accounts in a local vault on
  your own machine, rather than handing them to a remote service.
- **TOTP codes in the same place.** Generate time-based one-time passwords for
  services that support them, without switching to a second app.
- **QR import.** Bring accounts in by reading a QR code instead of retyping a
  long setup secret by hand.
- **Desktop capture on Windows and Linux.** Mawthooq can capture a window or a
  selected screen region, so you can take exactly the part of the screen you
  need.

## An honest note on maturity

Mawthooq is early software. It is **in active development and has not been
security-audited**. We are publishing it so people can try it and tell us what
is missing; we are not asking anyone to treat it as a finished security product.

There is no cloud sync, and there are no real passwords stored anywhere in the
project repository. What you put into your vault stays on the device you put it
on. We will keep this page and the release notes updated as the app grows.

## Who built it

Mawthooq was designed and built by **Amin** (Co-Founder, Software & Game Developer,
Morocco) and **Emad** (Programmer, Sudan). Both work on the app in Rust as part
of the 5A1F Studio software track.

## Get it

Download **v0.1.0** from the
[GitHub release page](https://github.com/official5a1fstudio/my-vault/releases/tag/v0.1.0).
You can also find the studio and its other work at
[5a1f.vercel.app](https://5a1f.vercel.app).

Feedback at this stage is genuinely useful: if something feels awkward or
broken, the release is the right place to say so.
