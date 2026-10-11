#!/usr/bin/env python3
"""Train a compact word trigram model from a JSONL corpus.

Each JSONL row must contain either:
  {"tokens": ["naman", "nitequiti", ...]}
or:
  {"text": "Naman nitequiti ..."}

The model keeps source spelling, lowercases for lookup, and writes:
unigrams.json, bigrams.json, trigrams.json, model-info.json
"""
from pathlib import Path
from collections import Counter, defaultdict
import argparse, json, re

WORD_RE = re.compile(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñĀĒĪŌŪāēīōūʼ’'-]+", re.UNICODE)

def tokenize(text):
    return [x.lower().replace("’", "'") for x in WORD_RE.findall(text)]

def top_map(table, limit):
    result = {}
    for context, counts in table.items():
        total = sum(counts.values())
        result[context] = [
            {"w": word, "c": count, "p": round(count / total, 6)}
            for word, count in counts.most_common(limit)
        ]
    return result

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("corpus", type=Path)
    ap.add_argument("output", type=Path)
    ap.add_argument("--top", type=int, default=12)
    args = ap.parse_args()

    unigram = Counter()
    bigram = defaultdict(Counter)
    trigram = defaultdict(Counter)
    sentences = tokens_total = 0

    with args.corpus.open(encoding="utf-8") as f:
        for line in f:
            row = json.loads(line)
            tokens = row.get("tokens") or tokenize(row.get("text", ""))
            tokens = [str(x).lower().replace("’", "'") for x in tokens]
            if not tokens:
                continue
            sentences += 1
            tokens_total += len(tokens)
            padded = ["<s>", "<s>", *tokens, "</s>"]
            for i in range(2, len(padded)):
                word = padded[i]
                unigram[word] += 1
                bigram[padded[i-1]][word] += 1
                trigram[padded[i-2] + "\t" + padded[i-1]][word] += 1

    args.output.mkdir(parents=True, exist_ok=True)
    (args.output/"unigrams.json").write_text(
        json.dumps([{"w":w,"c":c} for w,c in unigram.most_common()],
                   ensure_ascii=False, separators=(",",":")), encoding="utf-8")
    (args.output/"bigrams.json").write_text(
        json.dumps(top_map(bigram,args.top), ensure_ascii=False, separators=(",",":")),
        encoding="utf-8")
    (args.output/"trigrams.json").write_text(
        json.dumps(top_map(trigram,args.top), ensure_ascii=False, separators=(",",":")),
        encoding="utf-8")
    info={"model":"word trigram with bigram/unigram backoff",
          "sentences":sentences,"tokens":tokens_total,"vocabulary":len(unigram)}
    (args.output/"model-info.json").write_text(
        json.dumps(info,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(info, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
