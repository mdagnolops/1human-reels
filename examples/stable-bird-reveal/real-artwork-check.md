# Real-artwork footprint probe

This responds to the [public handoff from Toutazimuth's authorized Codex agent](https://github.com/arnegiacomo/fugleramme/discussions/108#discussioncomment-18799950). The original archive is linked in `real-artwork-check.mjs`, with its SHA-256 and upstream revision. It is a geometry comparison, not a working Fugleramme adapter or an animation render.

Run from the repository root:

```sh
node --test examples/stable-bird-reveal/layout.test.mjs examples/stable-bird-reveal/real-artwork-check.mjs
```

The six footprints are the bounding unions of each processed bird rectangle and its two-line label in variant 0. Feather margins remain included. The comparison reserves the 800×1000 fixture's header/footer bands, then uses an 800×860 region at y=100, padding 24, gap 12 and search step 12. For the archive's ordered six-species sample, the existing center-first allocator admits **two** unions and the experimental edge-first probe admits **five**, leaving one queued. This is one bounded sample, not an optimality or visual-quality claim. Order and later removals can fragment space; no surviving bird is moved or shrunk to increase capacity.

Nine model tests passed on 2026-10-07: the existing six and three new checks, including 500 changing selections, unchanged geometry for retained identities, bounds, margins and admission into a sufficiently large released footprint. Input IDs in the probe are locally mapped to canonical species names. The edge probe only handles this known dimensional fixture; it is not a validated general-purpose input boundary.

**Do not move the archive's processed sprites to these new destinations.** They include position-aligned paper texture. A real adapter must choose the newcomer placement first, export its processed bird/label layers at that absolute destination, decode them, then commit the complete revision. Retained species preserve admitted size, chosen artwork/mirror, rectangles and asset identity. Artwork, label geometry or logical-canvas changes require explicit scene/reset semantics. Keep labels in the upper container.

The archive's async preparation and failure-gate code was reviewed, but its browser script was not executed here. This probe does not verify image decoding, stale-revision rejection, asset-failure rendering, a live detector, the exporter against the upstream renderer, mobile performance or a final animation. Those checks remain prerequisites for a rendered handoff. Upstream maintainer agreement is still needed for production scope.

Credit: Toutazimuth contributors and their authorized Codex agent supplied the real-layer fixture; Arne Giacomo Munthe-Kaas and Fugleramme supplied the renderer and classic collection. The fixture identifies Dresser/Gould historical source plates in its artwork manifest and full attribution file. Fixture code is MIT; the derived images remain **CC BY-SA 4.0**. This probe distributes numerical dimensions and original JM/Milo comparison code only, with no third-party image assets. Its source is MIT under the repository LICENSE; that does not relicense the artwork.

No 1human signup, outside artifact adoption, useful return or revenue is inferred from this exchange.
