# UX definitions

This is the shared UX contract for the bilingual developer and photography portfolio. Preserve the existing content, page structure, typefaces, and experience palettes. The header contact button is the reference for actions throughout the site.

## Foundations

| Element | Definition | Source |
| --- | --- | --- |
| Page surfaces | Use paper, paper-2, and paper-3 for increasing surface emphasis. | `--color-paper*` |
| Text | Ink for headings and actions, ink-2 for body copy, muted for supporting text. | `--color-ink*`, `--color-muted` |
| Accent | Use the experience accent for links, focus, and meaningful emphasis. Primary actions use neutral ink, matching the header. | `--color-accent`, `--color-focus` |
| Typography | Space Grotesk for headings, Inter for body and actions, JetBrains Mono for numeric data and metadata. | `--font-display`, `--font-body`, `--font-mono` |
| Spacing | Choose from the existing spacing scale. Use xs between an icon and its label, sm between related actions, and lg for button inline padding. | `--space-*` |
| Actions and filter chips | Full pill shape; icon-only actions are circles. | `--radius-control` |
| Fields | Small rounded corners so editable controls remain recognizable. | `--radius-sm` |
| Media and panels | Moderate rounding. The floating header and mobile dock retain their capsule geometry. | `--radius-md`, `--radius-header`, `--radius-round` |
| Artwork and data grids | Printed magazine pages and the calculator grid retain square geometry. | Component styles |

Colors must resolve from the current experience and theme. Do not add page-specific button colors, radii, or font sizes. Media overlays use viewer colors for contrast; the dark error-page image surface maps action colors to on-dark tokens in both themes.

## Actions

Use `src/components/Button.astro` for standalone actions. It renders an anchor when `href` is supplied and a native button otherwise. Buttons default to `type="button"`; set `type="submit"` explicitly for submission. It adds no browser JavaScript.

| Style | Use it for | Appearance |
| --- | --- | --- |
| `primary` (default) | The main next step in a section, such as contact or error recovery. | Ink fill, paper text, pill shape. |
| `secondary` | Supporting actions, such as loading photos, retrying, or filtering a folder. | Transparent fill, visible outline, ink text, same geometry. |
| `ghost` | Low-emphasis utilities, such as theme, language, and clearing filters. | Transparent fill and border; surface feedback on hover. |
| `iconOnly` | Familiar utilities where an icon is sufficient. | Circular 44px target; an explicit localized `aria-label` is required. |

Keep one primary action per action group. Use clear verb-led labels from the localization system. An optional Tabler icon follows the label for direction or an external destination. Avoid icons that merely repeat obvious text.

There is one standard action size: 44px minimum height, 14px medium-weight body text, 8px icon gap, and 24px inline padding. Text actions grow to 48px minimum on coarse pointers. Icon actions remain at least 44 by 44px. Use min-height rather than fixed height for text so Spanish labels, text zoom, and narrow screens can wrap. Groups wrap before they overflow; labels should remain on one line when desktop space permits.

```astro
---
import Button from './Button.astro';
import Icon from './Icon.astro';
// labels comes from the current language's copy/ui entry.
---
<Button href={contactHref}>{labels.contact}<Icon name="arrow-up-right" /></Button>
<Button variant="secondary" data-grid-more>{labels.loadMore}</Button>
<Button variant="ghost" iconOnly aria-label={labels.close} data-close>
  <Icon name="x" />
</Button>
```

Apply `.button` to a noninteractive visual cue only when its containing link owns the action, as in PhotographyExplore. Never nest a button or link inside another link.

### Interaction states

| State | Definition |
| --- | --- |
| Default | The action's hierarchy is clear without hovering. |
| Hover | Fine-pointer devices get a surface or ink change, without changing dimensions. |
| Pressed | A small downward offset acknowledges activation. Reduced motion removes the offset. |
| Keyboard focus | Use the global 3px focus outline and 3px offset. Viewer controls retain inset outlines where their layout requires them. Never remove focus indication. |
| Disabled | Use native `disabled` on buttons; opacity uses `--opacity-disabled`. Links must remain valid navigation, so the component does not accept disabled links. |
| Busy | Set `aria-busy="true"`, prevent duplicate work in the controller, and retain the label and target dimensions. Use existing localized status text and live regions. |
| Selected filter | Use `aria-pressed="true"` and an ink fill; retain the selected appearance on hover. |

## Other interactive patterns

| Pattern | Rule |
| --- | --- |
| Navigation | Use links with `href`. Current pages use `aria-current="page"`. Keep plain header links and mobile dock items as navigation, with their existing active-section feedback. |
| Text links | Use `.text-link` for supporting destinations such as the resume. Inline prose links must remain recognizable without hover. Do not make every navigation link a filled button. |
| Filter chips | Use secondary Button with the chip's smaller inline padding. Keep counts as supporting mono text and selection in `aria-pressed`. |
| Viewer controls | Lightbox and magazine controls retain their positioning, zoom behavior, and viewer palette. Use the shared pill radius and at least 44px targets; zoom/reset controls may be wider. |
| Settings rows | Full-width, labeled rows inside the settings panel use panel rounding. A switch remains a switch, with `aria-checked`, rather than becoming an action pill. |
| Forms | Keep visible labels, native inputs/selects, and 48px field targets. Placeholder text supplements the label. Invalid fields use `aria-invalid` and a localized explanation. |
| Segmented choices | Keep native radio/checkbox semantics, visible selection, and keyboard focus. The calculator's units are a choice group, not two independent primary actions. |

## Responsive, accessible delivery

- Begin with the mobile layout. Let text and action groups wrap; preserve touch targets and safe-area spacing. Progressively enhance at the existing breakpoints.
- Use semantic landmarks, ordered headings, descriptive links, and real buttons. Preserve crawlable routes, canonical URLs, metadata, and language alternates when changing controls.
- All user-facing labels and states come from `src/i18n/content.ts`. Check English and Spanish, including longer labels.
- Verify light and dark themes in both experiences. Normal text and button labels need at least 4.5:1 contrast; focus and essential control boundaries need sufficient non-text contrast.
- Respect `prefers-reduced-motion`. Use short CSS feedback; do not introduce animation dependencies for controls.
- Reuse CSS and server-rendered Astro components. Avoid hydration, extra network requests, new fonts, or new image assets for basic controls.

## Applying the contract

This pass replaces the blue rectangular developer actions and standalone header contact styles with the shared neutral pill. Grid filters, retry/load actions, clear-filter utilities, and folder actions use the same Button component. Viewer controls share its geometry and target sizing while retaining their media-specific implementation.

Before adding a variation, select an existing style by the action's role. A new variation needs a reusable purpose and a definition here. Do not override an action's visual properties just to make one section look different.

For changes, run `pnpm check` and the relevant existing tests, then build. Visually inspect changed surfaces at mobile and desktop sizes, in both themes and languages. Check keyboard focus, long labels, selected/disabled states, and the production page's asset and performance impact.
