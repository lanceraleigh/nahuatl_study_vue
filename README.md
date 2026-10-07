# Nahuatl Study — Vue scaffold

A modular Vue 3 + Vite study application built from the existing standalone dictionary prototype.

## Run locally

1. Install Node.js.
2. Open a terminal in this folder.
3. Run:

   npm install
   npm run dev

## Current working features

- IDIEZ dictionary data extracted from the original standalone HTML
- Occidente definition search
- Macehualli headword search
- Notes saved in browser localStorage
- Basic word-prediction prototype
- Routes/placeholders for the planned learning modules

## Planned modules

- Interactive assignments
- Translator / conjugator
- Notes
- Flashcards / spaced review
- Prediction engine
- Children's activities
- Orthographic display modes
- Regional variants

## Data design rule

Do not overwrite source spellings to support alternate orthographies or dialects.
Keep source records immutable and add:
- source
- variety
- region
- orthography
- provenance/citation

as explicit metadata when new datasets are added.

## GitHub Pages

The router currently uses hash history so routes work on GitHub Pages without server rewrite configuration.
Before deployment, set `base` in `vite.config.js` to `/YOUR-REPOSITORY-NAME/` for a project site.

Then build with:

   npm run build

The deployable output will be in `dist/`.
