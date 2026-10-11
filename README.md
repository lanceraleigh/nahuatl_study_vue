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


## Trigram predictor

This version includes a first word-level trigram model trained from the uploaded
Chicontepec / Huasteca Veracruzana-oriented corpus.

Prediction order:
1. trigram: P(next | previous two words)
2. bigram backoff: P(next | previous word)
3. unigram backoff: P(next)
4. prefix fallback when the user has begun typing a word

Model files live in `src/data/language-model/`.
The reviewed/source-aware corpus lives in `corpus/cleaned/`.
The reusable trainer is `scripts/train_ngrams.py`.

To retrain after editing the JSONL corpus:

```powershell
python scripts/train_ngrams.py corpus/cleaned/huasteca_veracruzana.jsonl src/data/language-model
```

Then run:

```powershell
npm run dev
```

Open the Predictor page and type a few words. Clicking a suggestion inserts it.

### Important corpus note

This is a first automatic extraction, not a hand-corrected gold corpus. Source
metadata is retained so questionable sentences can be audited. Other Nahuatl
varieties should be trained as separate models rather than silently merged.
