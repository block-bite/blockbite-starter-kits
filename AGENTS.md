# Starter-kit guidance

This public repository owns authored starter source. Each theme lives under
`starters/<id>/` and has its own version in `catalogue.json`. Miette is the first
theme. Add folders only for implemented themes; do not scaffold empty examples.

- Use native Astro routes, layouts, slots, content collections and local assets.
  Keep shared navigation/footer content in one owner. Preserve supported direct
  `getEntry('pages', 'literal')` and native island calls for editable page content.
- Keep text, links and images declared in `fields.yaml`, with link labels separate
  from destinations. Ordinary Markdown articles use the native article layout.
- Use the theme's Tailwind tokens and local fonts. Keep the saved project Brand
  Guide consistent with actual source and asset bytes. No private editor package
  is a website runtime dependency.
- `files.json` is an explicit distribution allowlist. It excludes setup archives,
  package managers' dependencies, private editor state, recovery originals and
  credentials. Never discover and package an arbitrary folder recursively.
- Preserve font notices, photo source/author/license facts and code licensing.
  Do not copy imagery of unknown provenance from unrelated projects.
- Packaging reads only bounded ordinary files, rejects traversal and symlinks,
  and preserves a good release when validation fails. Do not weaken those guards.
- Run root `npm test` and `npm run build:miette`. With a reviewed runtime archive
  explicitly prepared, build the native site and inspect desktop/mobile rendering,
  navigation and meaningful interactions. Report those checks separately from
  source packaging and visual-editor controls.
- The portable runtime is currently provided by Desktop, not a verified public
  npm version. Preserve that explicit prerequisite. Publishing source does not
  make an unreleased dependency available.

MIT covers the starter code. Fonts and photographs retain their asset licenses.
