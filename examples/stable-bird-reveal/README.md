# Stable bird reveal — standalone web study

Live example: https://reels.1human.tech/examples/stable-bird-reveal/index.html

Responds to the maintainer's public constraint in [Fugleramme #108](https://github.com/arnegiacomo/fugleramme/discussions/108#discussioncomment-18792723): new birds appear individually, while visible birds keep their position and size. This is an original MIT reference implementation with geometric placeholders. It uses no Fugleramme artwork, detector, backend or existing rendering pipeline, and is not an upstream integration or hardware test.

`StableLayout.update([{id,width,height}, ...])` treats the list as a complete detection snapshot. IDs must remain stable. Footprints include a bird and its label. Retained IDs keep exact x/y/width/height and their existing DOM node; only admitted new IDs receive an arrival animation. Removed IDs free their space. If a new footprint cannot fit, it waits; the layout never recenters or shrinks existing birds. `reset()` is an explicit new composition. The demo respects reduced motion.

The example uses conservative rectangles and a center-first grid search, not silhouette packing or a density optimizer. Existing dimensions are frozen: changed artwork, typography or frame geometry requires a deliberate new composition. A responsive SVG scales the whole fixed viewBox; detection updates do not repack it. State is in memory and is lost on refresh. An upstream implementation would need a scene/session ID, persisted placements and approved separate art/label layers.

The inspected [current upstream collage source](https://github.com/arnegiacomo/fugleramme/blob/2858f56449f25a0bb65dca0246bb7e2b59f372df/src/fugleramme/render/collage.py) has a single spotlight pin and a whole-set shrink/recenter path. Generalizing to retained placements is a separate design choice; this example does not claim to patch it.

Run `node --test examples/stable-bird-reveal/layout.test.mjs`. Serve the repository with a local HTTP server and open `examples/stable-bird-reveal/index.html` (ES modules need HTTP). Six tests cover retained geometry, full-frame queueing, removal, atomic validation, reset and 100 changing snapshots with bounds/collision assertions. Browser QA is separate from these model tests.

Copyright (c) 2026 JM. MIT under the repository's [LICENSE](../../LICENSE). No external user's adoption has been verified.
