# SHIFFT

SHIFFT is a single-page Astro demo for an Autumn/Winter activewear campaign. It moves from the campaign portrait and original brush artwork through the collection looks, the Shift Trail 01 showcase and construction details, the Best Sellers grid and a print editorial. The same page runs in a browser and in BlockBite Desktop.

## Open in BlockBite Desktop

1. Choose **Open existing project** (⌘O on Mac), then **Continue** and **Choose project folder**. Select the `starters/shifft` folder containing this starter's `package.json`.
2. Choose **Review project**. On a fresh checkout, choose **Save setup package** to place Desktop's runtime in `.blockbite/packages/`. In the selected folder, run `npm ci --ignore-scripts` with Node 22.23.4 or newer. The included lockfile expects the matching Desktop archive.
3. Choose **Check again**, then **Add project** when the checks pass. Open **Siteboards** and select the home page. Select a section, open **Content**, change an existing heading and save it.
4. Choose **Play** and approve starting the local preview when prompted. Scroll the page in Native Play to see the real Astro layout, the ink animation and the collection. Changes are written to the folder you opened.

## Run with Astro

If Desktop supplied the runtime using the steps above, run `npm run dev` from the starter folder. Follow the URL printed by Astro. For a fresh checkout with a matching archive already available, run these commands from the starter-kits repository root.

```sh
node scripts/prepare-runtime.mjs shifft /absolute/path/to/blockbite-astro.tgz
cd starters/shifft
npm ci --ignore-scripts
npm run dev
```

Run `npm run build` to create `dist/`, then `npm run preview` to inspect the static output.

## What to edit

| Surface | Where it lives |
| --- | --- |
| Campaign copy, image, product details and collection looks | `src/content/pages/home.json` |
| Shared navigation, logo and footer | `src/content/pages/shared.json` |
| Editable field definitions | `src/islands/<family>/<variant>/fields.yaml` |
| Display type, fonts and store colors | `src/styles/theme.css` |
| Brush reveal, mission statement and fictional sign-off at `/#motion` | `src/islands/story/ink/` |
| Collection at `/#collection` | `src/islands/collection/arrivals/` and `siteboard/scenes.json` |
| Shoe swatches and photo zoom at `/#trail` | `src/islands/product/trail/` |
| Shoe construction close-ups at `/#trail-details` | `src/islands/product/trail-details/` |
| Best Sellers grid at `/#best-sellers` | `src/islands/catalog/best-sellers/` |
| Print artwork and graphic tee at `/#print` | `src/islands/story/print/` |
| Local Brand Guide and its artwork | `brand/brand.json` and `brand/assets/` |

## Art direction

The campaign supplies the SHIFFT wordmark, brush, photography, “Move Without Limits” line and Inter Black Italic display treatment. Body text uses regular Inter with an Arial fallback. Buttons, swatches and icon controls use the full radius defined by `--radius-action`.

The motion treatment and spacing are proposals for this web edition. The ink shader follows the silhouette of the supplied brush, revealing its edges as the visitor scrolls. The collection shifts attention from the trail shoe to the graphic tee and full look. Check that a shopper can still read each caption, see the whole product on a phone and reach the shoe detail with reduced motion enabled.

## See the Brand Guide in use

Open **Brand Guide** from the SHIFFT project. **Typography** previews the bundled Inter faces. **Design System** points to the site's font, color and action radius tokens in `src/styles/theme.css`. The same theme drives the browser and native Play.

- **Display.** The campaign headline and the Mission section use Inter Black Italic at 900 through `--font-display` and `.shifft-display`. The narrow tracking and tight lines carry the campaign type.
- **Body.** The mission paragraphs and product descriptions use upright Inter through `--font-sans`. The labels and prices use heavier weights where they need emphasis.
- **Icons.** Compare the previous and next controls in New Arrivals with the Our story arrow. The arrows share a 24px grid and rounded 2px strokes. The same SVGs are listed in **Brand Guide → Edit → Assets → Icons**. The hero uses SHIFFT’s original brush artwork.

Open **Siteboard → Content** to change a heading or a link label, then open **Play** to see the same styles applied to the edit.

## Capture beats for Remotion

Record these short takes from the existing project for the video edit. Live Desktop footage and the final cut are pending.

| Take | Capture |
| --- | --- |
| 1 · Campaign | Hold the opening portrait long enough to read “Move Without Limits.” |
| 2 · Edit | Change the existing hero heading in Desktop, save and switch to Native Play. Hold on the changed heading. |
| 3 · Motion study | Scroll to “Engineered to Move” and let the brush resolve before cutting. |
| 4 · The drop | Advance through the shoe, tee and complete look. Follow “Explore the shoe,” switch to Blush / Black and zoom into the artwork. |
| 5 · Editorial | Cut from the trail shoe to the upper and tread close-ups. Follow the tee from Best Sellers to the original ink artwork and the chest print. |
| 6 · Handoff | Close Desktop and open the same local project using `npm run dev`. Show the saved heading in the browser. |

## Source and rights

Starter code uses the MIT license. SHIFFT campaign artwork is supplied for this demo. Review the [artwork notices](public/ASSET-NOTICES.md) before reusing it in a published project. Inter is bundled under the [SIL Open Font License](public/fonts/INTER-LICENSE.txt).
