# Darkroom Editorial — Photographer Experience

Planning source for the redesign of `/en/ph/` and `/es/ph/`.

## Design thesis

The photographer home should feel like entering a small exhibition already in progress: quiet typography followed immediately by a paced sequence of photographic spreads. The photographs provide the spectacle; the interface stays restrained.

## Audience and job

- Audience: editors, collaborators, clients, and people exploring David's photographic practice.
- Primary job: help visitors understand the point of view and enter a photographic series.
- Tone: observational, tactile, darkroom editorial.

## System to preserve

- Astro's static, multilingual route structure.
- The existing warm paper / graphite / amber photographer palette.
- Space Grotesk for display, Inter for reading, and JetBrains Mono for archive metadata.
- The 4-point spacing tokens and existing focus/reduced-motion behavior.
- The shared site header, footer, theme control, and language switch.
- Astro image optimization and truthful gallery data from `photoGalleries.ts`.

## Structural fingerprint

Macrostructure: long-form photographic index.

```text
Archive introduction
        ↓
First series as visual thesis
        ↓
Sticky series metadata  |  art-directed two-image spread
        ↓
Alternating series compositions
        ↓
Archive credit / site footer
```

The numbered markers are an archive index (`01 / 07`), not decorative chapter labels.

## Signature interaction

One interaction carries the page: each photographic spread stays visually still, then neighboring imagery recedes subtly when its series link is hovered or keyboard-focused. No autoplay carousel and no universal scroll reveals.

## Responsive behavior

- 320–414 px: the archive introduction leads directly into single-column series spreads with deliberately offset detail images.
- 768 px: series metadata remains stacked with larger paired-image compositions.
- 960 px and above: series metadata becomes sticky beside the image spread; alternating rows reverse the visual balance.
- Clickable labels never wrap. Images use `minmax(0, 1fr)` tracks and remain within the viewport.

## Performance and accessibility

- Prioritize only the first series cover; lazy-load the remaining series imagery.
- Remove the continuous GSAP marquee and its cloned DOM.
- Keep the opening free of decorative entrance animation.
- Keep full keyboard focus and visible textual actions.
- Preserve reduced-motion behavior.
- Use localized existing copy and real gallery counts; do not invent metrics or claims.

## Implementation checklist

### Phase 1 — landing-page structure

- [x] Remove the standalone hero so the archive itself becomes the opening composition.
- [x] Convert the uniform carousel into long-form art-directed series spreads.
- [x] Preserve natural photographic ratios instead of forcing every cover into `5 / 6`.
- [x] Add truthful archive position, location, and photograph count metadata.
- [x] Restyle the photographer mode switch as typographic masthead navigation.
- [x] Remove continuous marquee controls, cloning, and drag behavior.
- [x] Prioritize the first archive cover as the page's LCP image.
- [x] Validate the final layout at 320, 375, 414, 768, and desktop widths.
- [x] Verify light and dark modes visually.
- [x] Verify English and Spanish text lengths visually.
- [x] Run Astro checks and a production build.

### Phase 2 — gallery continuity

- [x] Carry the Darkroom Editorial masthead treatment into individual series pages.
- [x] Add a shared-image route transition from each home spread into the first gallery plate or Magazine cover.
- [x] Review each series cover/detail pairing and replace automatic choices with a curated image map.
- [x] Review gallery-page navigation and closing transitions as one continuous exhibition path.
- [x] Keep Magazine as a configured alternate mode and frame it within the same opening/closing system.

Phase 2 establishes two deliberate reading modes:

- **Continuous sequence** is the default. The selected cover returns as plate 01 inside the natural gallery rhythm—without a separate cover block—while the photographs alternate between paired, offset, and full-width placements and the closing frame previews the next complete story.
- **Magazine edition** remains opt-in through a gallery JSON configuration. It begins directly with the page-turn reader, keeps full-screen controls and a clear edition identity, and uses the same next-story handoff as continuous galleries.

### Phase 3 — content refinement

- [x] Add one dedicated assignments/collaborations action at the end of the archive rather than repeating it after every series.
- [x] Reuse the camera photograph as a quiet working-practice section, not as a second hero.
- [x] Confirm captions, series context, and ordering in both languages.

Phase 3 keeps the content deliberately factual:

- Gallery captions use plate position plus the localized series context; technical filenames remain available to the lightbox download path but are no longer presented as editorial captions.
- The archive order remains Spain → Autódromo → motocross → bicycles → dogs → Achira → ongoing archive. It moves from place through speed and machines into animals, portrait, and an open-ended notebook.
- The closing action is reserved for editorial assignments, commissions, and image-led collaborations. It appears once, beside the working camera photograph, so individual series can end by continuing into another story.

## Acceptance criteria

- The page reads as a photographic exhibition rather than a product carousel.
- Every series has a distinct visual rhythm without becoming a card grid.
- No horizontal overflow occurs at supported mobile widths.
- Light/dark mode, localization, keyboard navigation, and reduced motion remain functional.
- Image loading and JavaScript weight are no worse than the current implementation.
