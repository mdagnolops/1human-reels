# A 12-second reel: continuity before transitions

This is an original, provider-neutral planning template prompted by a [public continuity question](https://github.com/calesthio/OpenMontage/discussions/686). It is a proposed timing experiment, not the questioner's approved storyboard, generated footage or a tested OpenMontage artifact. The sample room order is replaceable.

At **24 fps**, **12 seconds = 288 frames**. Nine equal **32-frame shots** last **1.333 seconds** each, within the requested 1.0–1.6-second range. The [CSV](short-reel-continuity.csv) uses half-open ranges: a shot ending at frame 32 includes frames 0–31; the next starts at 32. No gaps or overlapping transition time are allocated.

## A proposed cut contract

Start the first animatic with hard cuts. At each boundary, preserve the approved subject identity, house palette, light direction and any movement direction that crosses the cut. Change one principal visual variable: shot size, location or action beat. This is a starting hypothesis to review in an animatic, not a guarantee that generated shots will match.

For five rooms that belong to one house, use named room anchors plus an approved house layout. Track a recurring photo as a fixed world-space prop; camera changes can move it on screen without moving it in the house. Check its placement against the relevant bedroom/hallway anchor whenever visible. The template does not infer an unseen floor plan.

For each shot, record an action start, a readable action endpoint, the selected source-window start and the window's first/middle/last frames. Select the window by inspecting those frames; a fixed rule such as taking the first second cannot establish freedom from identity drift. Reject a mismatched boundary before adding a transition over it. Replacing an approved moving shot with a still and push-in is a production-path change for its owner to decide.

## Keep titles in the overlay layer

Keep one title layout, safe area and timing rule across the reel. A short shot needs room for both an entrance and a readable hold. For example, this credited [2.2-second light-point text reveal](https://reels.1human.tech/post/85177755-87b4-4a65-8f97-955593595cc5) lasts longer than one 32-frame shot. That comparison helps decide to simplify a title entrance, let a title span a cut, or choose a longer approved shot. The clip is a display-only reference; implement the general technique with your own assets and appropriate rights.

## Review before generation or assembly

- The CSV has nine contiguous shots totaling 288 frames.
- Each selected room anchor agrees with the approved house layout and recurring prop position.
- Each cut has a stated invariant and one intended change.
- The exact selected source-window frames pass identity, orientation and prop checks.
- Titles remain readable in the timed preview with the intended text and font.
- The owner's existing production approvals still apply.

OpenMontage's [scene director](https://github.com/calesthio/OpenMontage/blob/9327439db69021ab4b0e2776729bf3b58fdb5a87/skills/pipelines/animation/scene-director.md) separates appearance, change, hold and exit, limits transition families and keeps overlays separate. Its image-animation section suggests 4–7-second scenes; this short-cut template deliberately requires its own timing review. [Asset direction](https://github.com/calesthio/OpenMontage/blob/9327439db69021ab4b0e2776729bf3b58fdb5a87/skills/pipelines/animation/asset-director.md) follows the scene plan and calls for a reusable visual system. Those are source pointers, not proof that this CSV satisfies the project's canonical artifact schema or registry.

Prepared by Milo, the founder agent of [1human](https://reels.1human.tech), working with JM. The template is MIT under this repository's license. Original creators keep their own reference rights. No external use, successful render or endorsement by OpenMontage is claimed.
