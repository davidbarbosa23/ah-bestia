# SOLID review

Reviewed on 2026-10-10. The review covered components, layouts, routes, localization, photo data, image processing, and project scripts. Refactoring focused on the highest concentrations of unrelated responsibilities. Website functionality, content, styles, routes, and image delivery were preserved.

## Findings and changes

| Finding | Change |
| --- | --- |
| The calculator combined options, markup, cycling arithmetic, events, and DOM updates. | Keep markup in `FixedGearCalculator.astro`, options in `data/fixedGearOptions.ts`, browser interaction in `scripts/fixedGearCalculator.ts`, and calculations in `utils/fixedGear.ts`. |
| The magazine embedded its reader controller and paper geometry in a large template. | Move interaction into `scripts/photoMagazine.ts` and DOM-independent geometry into `utils/paperFold.ts`. Keep scoped styles in their original component. |
| The lightbox embedded a substantial browser controller in its template. | Move the controller unchanged into `scripts/photoLightbox.ts`, preserving event registration, animation, zoom, focus return, and cleanup. |
| Photo filtering was intertwined with asynchronous loading and rendering. | Extract bilingual tag aliases and filtering into `utils/photoFilters.ts`. The controller retains request cancellation, revision checks, debounce, history, and rendering. |
| Gallery and archive loaders repeated the image glob, and gallery/story types depended on each other. | Use one build-time catalogue in `data/photoAssets.ts` and shared contracts in `types/photos.ts`. Keep existing type re-exports compatible. |
| Gallery content, discovery, and magazine validation lived together. | Move authored series into `data/galleryDefinitions.ts` and resolve magazine configurations through `services/photoMagazine.ts`, which receives assets explicitly. |
| Grid and viewer code duplicated language-link query synchronization. | Share `syncPhotoLanguageLinks` in `utils/photoUrl.ts`, retaining filters and photo deep links. |
| README described GSAP and paginated archive routes absent from the source. | Correct those descriptions and document current modules and test commands. |

## Applying SOLID in this project

- **Single responsibility:** templates render content, controllers coordinate browser interaction, data modules hold authored configuration, and pure functions own calculations, filtering, and geometry.
- **Open/closed:** series and magazine content extend through typed definitions and configurations. Rendering and validation consume those records without per-series branching.
- **Liskov substitution:** the existing `HTMLElement` lifecycle and Astro image-service contracts remain intact. No new inheritance hierarchy is needed for the extracted functions.
- **Interface segregation:** filtering accepts only `folder`, `tags`, and `search`, rather than requiring image URLs, dimensions, translations, or a gallery loader. Shared photo types introduce no runtime imports.
- **Dependency inversion:** magazine resolution receives its image catalogue from the caller. Calculation and filtering functions receive plain values and do not reach into the DOM, fetch data, or discover assets.

These are maintainability boundaries, not a blanket certification of every future change. The existing layout, header, and error-page logic retain their current behavior.

## Verification

- `pnpm check`: zero errors, warnings, or hints; all 27 style sources pass token validation.
- `pnpm test`: 12 regression tests covering default calculations, skid positions across all selectable gears, equivalent gears, tire effects, bilingual filtering, fold geometry, and magazine validation.
- `pnpm build`: all 29 pages build successfully.
- Compared the refactored functions with the original implementation: 10,890 gear setups, 495 equivalent-gear searches, 303 folds, and 396 filter combinations produce identical results.
- Compared production output with a pre-refactor build: all 29 HTML documents match after excluding executable script blocks. JSON-LD and embedded JSON were retained in the comparison. All seven generated CSS files and 1,245 remaining non-script assets match byte for byte, including photo manifests and sitemaps.
- Production output still has five external JavaScript files. Their combined uncompressed size changes from 49,597 to 49,657 bytes (+60); calculator pages each contain 226 additional bytes of inline JavaScript. No dependencies, asset variants, or network requests were added. Calculator option arrays are built only on the server.
- Browser smoke checks at desktop and 390px mobile widths: metric/imperial calculation, both leading feet, live announcements, search, load more, lightbox navigation/zoom/Escape/focus return, magazine forward/back/expanded view/zoom, and language switching with filters. Checked English and Spanish and both themes; no horizontal page overflow or browser console errors were observed.

The browser checks are representative smoke tests, not exhaustive gesture or Core Web Vitals measurements. Existing reduced-motion rules and accessibility markup are preserved by the output and controller comparisons.

## Maintaining the boundaries

Run `pnpm check`, `pnpm test`, and `pnpm build` before merging changes. Add numerical or filtering behavior to the pure modules and keep browser lifecycle work in the controllers. Import photo contracts directly from `types/photos.ts` when no data loader is needed. Keep CSS with its current owner so component scope and route-specific loading remain stable.
