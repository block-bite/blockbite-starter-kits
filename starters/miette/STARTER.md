# Miette Club bakery starter

A native Astro example with five main pages and three Markdown journal articles.
Miette is a fictional bakery identity. Replace demonstration prices, address,
hours and copy with verified business information before publication.

## Source map

- `src/layouts/SiteLayout.astro` owns document structure, shared header/footer
  defaults and named `header` / `footer` slots. A page can override either slot.
- `src/content/pages/shared.json` owns the shared announcement, navigation and footer
  copy once. Change a destination here to update all routes.
  The shared header uses a native mobile disclosure with a hamburger control,
  keyboard/Escape support and outside-tap dismissal. Desktop keeps the links
  visible. The script reads the Tailwind breakpoint result; links remain
  available through the native disclosure when JavaScript is unavailable.
- `src/pages/*.astro` compose the five pages through fixed native island calls.
  Their content lives in `src/content/pages/*.json`.
- `src/content/articles/*.md` contains real articles, rendered through
  `src/pages/le-journal/[slug].astro` and `ArticleLayout.astro`. Articles with
  `draft: true` are excluded from the static build.
- `src/islands/<family>/<variant>/` contains native source and editable field
  declarations. `src/components/menu/` owns the interactive menu and product cards.
- `src/styles/theme.css` owns the actual Tailwind palette, typography and fonts.
  All buttons use the pill-shaped `--radius-button` token. Calls to action share
  `py-3.5 px-6`, `text-label` and a one-pixel border. Filled primary actions
  use bordeaux with butter-yellow text and an ink hover state. The inverse
  variant uses butter yellow on bordeaux sections, with a cream hover state.
  The outlined primary variant uses a transparent background, bordeaux text
  and border, then fills bordeaux with butter-yellow text on hover. See
  “Toute la carte” in `features/signatures` for its native, editable example.
  Each variant has a matching visible focus ring and respects reduced motion.
  Photographs and product media frames use `rounded-image`, backed by the
  subtle `--radius-image: 0.5rem` (8px) token across all pages and articles.
  The saved Brand Guide references this variable as `ImageRadius` and records
  its usage under Visuals; image bindings and the original logo are preserved.
  Interaction duration (160ms), easing and optional lift (2px) are shared
  theme tokens referenced by the Brand Guide. Normal links underline and
  change colour on hover/focus; buttons, filters and disclosures have explicit
  hover, focus, selected/open and press states. Feature and journal cards are
  single native links. Reduced-motion settings disable decorative movement
  and transitions; keyboard focus remains visible.
  `PageGutter`, `SiteWidth` and `LayoutBreakpoint` reference the native mobile
  gutter, site container and wide-layout breakpoint. Editorial columns fill
  the mobile container and align left; split layouts begin at 64rem. The
  yellow strip has three independent string fields, stacked and centered
  below that breakpoint. Tablet grids use two columns before three.
- `brand/brand.json` and `brand/assets/` contain an independent, unpublished
  Miette Brand Guide, including its existing monogram, licensed fonts and photos.

## Preview and editing

Desktop creates the scaffold and supplies the portable runtime archive. In a
prepared project, run `npm run dev` or `npm run build`. See the starter repository
README for standalone runtime preparation; no public npm runtime is assumed.

Main-page and shared-layout content use the same source-bound JSON format.
The layout reads the single `shared` entry through native `getEntry`. In a
compatible Desktop, open Template → SiteLayout, then its Header component call
to edit shared fields once. Slot assignment stays protected. Select the Header
or its dialog layer and choose **Reveal dialog** for temporary editing; **Hide
dialog** restores the closed presentation. These actions do not save menu state.
Use native Play to exercise the real menu, focus, navigation and slide animation.
Markdown articles use Astro content collections. Source validation and a native
build do not by themselves prove every visual-editor control works.

## Provenance

Canonical source: `block-bite/blockbite-starter-kits`, `starters/miette`, version
1.0.0. Framework distributes a generated offline artifact; it does not maintain
a second authored website. No fixture drafts or recovery data are included.

Starter code uses MIT (`LICENSE`). Photographs are licensed Pexels renditions;
retain `public/ASSET-NOTICES.md`. Font copyright and SIL OFL notices remain in
`public/fonts/`. The Brand Guide contains owned copies of those same assets.

## Mobile navigation

The Header owns a native `<dialog>` and ordinary `navigation.ts` browser code.
`showModal()`/`close()` provide modal semantics; Tailwind supplies full dynamic
viewport sizing and the Bordeaux/Creme/Beurre palette. The slide uses
`--duration-navigation` and `--ease-interaction`, both referenced by the Brand
Guide; reduced motion skips it. Escape and close return focus, navigation and
desktop resize close the menu, and background scrolling is restored on cleanup.
Text, the approved logo and all destinations are root `fields.yaml` fields.
Desktop and mobile share the same navigation values. The `.example` email and
location/hours copy are fictional starter content to replace before publication.
A native link list is available without JavaScript. No BlockBite runtime script
or custom interaction binding is required by the website.
