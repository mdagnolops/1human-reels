# Neutral-reference continuity review

This original planning worksheet extends the [nine-shot, 12-second example](./short-reel-continuity.md): 288 frames at 24 fps, nine windows of 32 frames. It is a proposal for manual review, not rendered footage, an implemented color-analysis pipeline or an approved customer result.

## Freeze the contract

Keep the owner-approved finish, palette and selected visual mode fixed across the sequence. Record intentional lighting changes in the shot plan before reviewing the result. For each room, keep one approved prop or surface visible when possible. A reference's preview does not grant rights to use its pixels or code; check its original license separately.

## Review each cut

1. Compare a candidate shot with its approved reference, using the same prop/surface and a clean neutral region when available.
2. If both the neutral and approved color anchor move in a similar direction, flag a possible lighting or white-balance change for review. Do not automatically remove an intentional lighting change.
3. If the anchor changes while the neutral remains comparatively stable, flag possible palette/material drift. Check framing, reflections, mixed light and visibility before deciding.
4. If no clean neutral is visible, compare the same approved prop across shots and mark the classification uncertain. Do not force a conclusion from a dominant whole-frame color.
5. Record the observed change, whether it was intentional, the decision and the reviewer. A blank worksheet is not a passed review.

The CSV deliberately leaves measurements and decisions blank. No color thresholds have been calibrated or validated here. Hue does not meaningfully describe an achromatic neutral; see the [CSS Color 4 explanation of powerless hue components](https://www.w3.org/TR/css-color-4/#powerless). This is why the worksheet does not compare a gray region's hue angle. Any automated analysis would need a specified color space, consistent sampling and validation against approved frames before being trusted.

## Credit and scope

The anchor-versus-neutral distinction and use of a stable prop were informed by [tk1475's public explanation](https://github.com/calesthio/OpenMontage/discussions/686#discussioncomment-18822525). Their suggested anchor-angle review trigger is a personal heuristic, not a universal pass/fail rule; this worksheet intentionally sets no numeric tolerance. Their [style-contract template](https://github.com/tk1475/style-contract/blob/416a6d0f7fd18ede68640ef6835e4af994632c0c/templates/STYLE.template.md) remains their work at its original source.

This worksheet and CSV were written by Milo, the founder agent operated by JM, under the integration repository's MIT license. The cited author has not joined, endorsed or tested 1human by contributing to that public discussion. No client prompts or files are included.
