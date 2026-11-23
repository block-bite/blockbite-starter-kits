# BlockBite starter kits

One Git monorepo for independently versioned native Astro starters. The first is
**Miette Club**, a French bakery with local photography, a shared site layout,
three Markdown journal articles and a matching project Brand Guide.

```text
catalogue.json                 Starter IDs and versions
starters/miette/               Canonical authored Miette source
starters/shifft/               SHIFFT sportswear demo store and editable campaign scene
scripts/                      Bounded source-artifact packaging
tests/                        Distribution and preservation checks
```

## Use Miette

Desktop supplies the portable `@blockbite/astro` runtime archive when creating a
project. That runtime is not yet a public npm release. A plain clone is therefore
source for review; it does not yet support an unprepared `npm install`.

For standalone development, supply a reviewed BlockBite setup archive explicitly:

```sh
node scripts/prepare-runtime.mjs miette /absolute/path/blockbite-astro.tgz
npm --prefix starters/miette install --ignore-scripts
npm run dev
```

Run `npm run dev` from the repository root to open Miette directly. Astro prints
the local URL and watches the starter source for changes.

The archive stays in ignored `.blockbite/`. Never commit runtime archives,
credentials, editor drafts, recovery files, `node_modules` or builds.

## Use SHIFFT

For a fresh checkout, prepare the Desktop archive matching the SHIFFT lockfile, then start its Astro preview from the repository root.

```sh
node scripts/prepare-runtime.mjs shifft /absolute/path/blockbite-astro.tgz
npm --prefix starters/shifft ci --ignore-scripts
npm run dev:shifft
```

SHIFFT is a single campaign page. Scroll through the original brush reveal, a three-look collection and the Shift Trail 01 detail. Open the prepared folder with **Open existing project** in BlockBite Desktop and view the home page in Native Play. The [starter guide](starters/shifft/STARTER.md) covers Desktop setup, Astro preview and the Remotion shot list.

## Package one starter

```sh
npm test
npm run build:miette
# Or package SHIFFT
npm run build:shifft
```

Each command writes `dist/<id>-<version>.json` containing the inert files in
that starter's `files.json`. Packaging does not install or execute project
dependencies. Desktop performs its own content validation before bundling or
seeding. The starter's package/config files are for standalone preparation;
Desktop owns its scaffold and supplies the runtime archive separately.

Versions belong to each starter. A future release can use `miette-v1.0.0` and
publish that starter's artifact and checksum. A theme picker can download one
artifact without cloning the entire repository. Remote discovery/download and
the public runtime release remain separate work; this catalogue does not claim
that Desktop consumes a live remote release today.

The private Framework repository keeps only a generated offline Miette artifact.
Change authored source here, then explicitly refresh that artifact. Each project
receives independent source and Brand Guide files; starter updates never overwrite
existing projects.

## License

BlockBite-authored starter code is MIT licensed. Photographs and fonts retain
their own licenses and notices in each starter's `public/ASSET-NOTICES.md` and
`public/fonts/`. These are demonstration identities and business details; replace
them with verified information before launching a real business website.
