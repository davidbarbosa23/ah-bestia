## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Project standards

Apply these requirements to every change:

- Check the performance impact and avoid unnecessary JavaScript, network requests, rendering work, and asset weight.
- Follow current SEO best practices, including semantic HTML, metadata, crawlability, canonical URLs, structured data where appropriate, and strong Core Web Vitals.
- Design and implement mobile-first, then progressively enhance layouts and behavior for larger screens.
- Use the existing design-token system before introducing one-off style values. Prefer reusable components and shared patterns over duplicated markup or styles.
- Verify the change in both light and dark modes.
- Preserve multilingual support. Do not hard-code user-facing copy when it should use the project's localization system, and account for varying text lengths.
- Maintain accessibility principles, including semantic structure, keyboard support, visible focus states, sufficient contrast, appropriate labels, and reduced-motion preferences.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
