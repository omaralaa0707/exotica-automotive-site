# Exotica Automotive — site 32 of 46

A concept site built entirely from this dealership's own published material.
**Not affiliated with Exotica Automotive, and not an official site.**

- **Live:** https://exotica-automotive-site.vercel.app
- **Repo:** [exotica-automotive-site](https://github.com/omaralaa0707/exotica-automotive-site)

## What this page is about

Every site in this series is built around something true and checkable about
the dealer's own account — a pattern in what they publish, a contradiction
between two of their channels, or a fact about their showroom — rather than
around a generic template. The palette, type, 3D piece and motion below were
all chosen to serve that finding.

## Design record

**Palette**
: Their own showroom, measured: the left wall panel grey #BDBDBD as the page ground — the **first genuinely mid-value grey ground in the set** (L* ≈ 77; every other light page sits at L* ≥ 91) — the white faceted wall #DFDFDF for raised cards, the dark panel #242424 behind every car as primary text, and #474747 for hairlines only. Seven measured cabin "hides" (cognac, brick, coral, signal red, sand) are permitted only as fills — swatches, bars, voxels — never as text, a border or a control

**Type pairing**
: Martian Mono + Wix Madefor Text / Cascadia Mono + Parastoo (AR)

**3D / signature technique**
: **The colour solid**: a build-time HCL histogram of all 78 sourced photographs, rendered as an instanced-box voxel field standing where the car would be. Stepping a car's eleven published positions hard-cuts the instance buffer — no tween — so the object visibly collapses to a bare grey column on the achromatic axis for the five monochrome exterior slides and grows a coloured mass the instant the interior starts; a pointer-driven saturation "caliper" turns every instance below a chosen threshold grey while the exterior column never moves, because there is nothing off-axis to cut. The group rotates about the vertical (Y) axis specifically because every grey cell sits on x=z=0, so the neutral axis is a genuine fixed point of the rotation

**Motion language**
: **The advance**: every block is fully positioned and legible from its first frame; each child of a revealed group jumps from `opacity:0` to `1` in a single animation frame on a fixed 60ms-per-child clock (`steps(1,end)`) — no easing, no travel, no fade, no blur, matching the hard cut their own carousel makes between position 4 and 5. Car, position and locale changes are all hard cuts too (`transition:none`), never a cross-fade

## Sources

Everything on the page was sourced from:

- Instagram: https://www.instagram.com/exoticaautomotive/
- Google Maps: https://www.google.com/maps/place/Exotica+Automotive+by+Hassan+Sabry/data=!4m2!3m1!1s0x0:0xac15843bd629d37c

Photography belongs to the dealership (or, where their frames are watermarked
by an outside studio, to that studio) and is used here only to document their
own published material. No figure on the page is invented: anything the dealer
did not publish is marked as unpublished rather than estimated.

## Running it

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build — must pass before shipping
pnpm lint     # eslint, zero warnings
```

Requires `node-linker=hoisted` in `.npmrc` (already present) or three.js peer
deps fail to resolve.

## Structure

```
src/content/media.ts      verified facts and figures — the data layer
src/content/en.ts|ar.ts   all copy, both locales, identical shapes
src/content/schema-ext.ts the page-specific content contract
src/components/webgl/     the 3D piece
src/components/site/      the page composition
src/app/globals.css       palette tokens, type, RTL overrides, motion
```

Arabic/English toggle with full RTL. All CSS direction overrides key off
`[dir="rtl"]` (never `[lang]`) and live outside `@layer`. Every Latin or
numeric fragment inside Arabic copy is wrapped in `.latin` for correct bidi.

---

Part of a 46-site series. See the [top-level README](../README.md) for the full
index and [`TRACKING.md`](../TRACKING.md) for the differentiation log.
