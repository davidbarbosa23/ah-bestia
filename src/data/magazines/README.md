# Photo magazines

Add a JSON file whose filename matches a photo gallery slug to render that gallery as a magazine. For example, `random.json` configures `/ph/random/`.

```json
{
  "pageSize": { "width": 3, "height": 4 },
  "pages": [
    {
      "image": "photo.jpg",
      "fit": "cover",
      "position": "50% 50%",
      "tone": "ink",
      "alt": {
        "en": "Optional English description",
        "es": "Descripción opcional en español"
      }
    }
  ]
}
```

- `pageSize` controls the physical page proportion and defaults to `3 × 4`.
- `pages` controls the exact image selection and reading order. The first entry is the cover.
- `image` must match a filename in that gallery's asset folder.
- `fit` accepts `cover` (default) or `contain`.
- `position` accepts any CSS `object-position` value and defaults to `50% 50%`.
- `tone` accepts `ink` (default) or `paper` for the page behind the photograph.
- `alt` is optional localized alternative text. When omitted, the gallery title and page number are used.

Remove the same-slug JSON file to return a gallery to the standard photo grid.

Magazine pages can contain crops, typography, and other composed layouts. To use the original photographs in “All photographs”, set the gallery's `archiveFolder` in `src/data/photoGalleries.ts` and place JPG copies under `src/assets/photography/archive/<archiveFolder>/`. Add tags and bilingual descriptions for those photographs in `src/data/photoTags.ts`. The archive then uses these photos instead of that gallery's magazine assets, while the magazine continues to use its configured pages.
