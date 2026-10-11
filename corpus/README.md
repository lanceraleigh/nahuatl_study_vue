# Corpus

`cleaned/huasteca_veracruzana.jsonl` is the first source-aware training corpus.

Each row stores:
- source ID/title
- variety and region
- PDF page
- retained sentence
- token list

The first build intentionally prioritizes Chicontepec / Huasteca Veracruzana material.
The cleaning pass is conservative but heuristic, so this should be reviewed rather
than treated as a hand-verified gold corpus.

The uploaded Tlaxcala, Morelos, and other-variety materials were not folded into
this first model. They can later become separately selectable models.
