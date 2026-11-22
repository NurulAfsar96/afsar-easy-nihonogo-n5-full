# Afsar's easy Nihonogo

A Bengali-first Japanese-learning companion built with React + Vite. Static frontend only; learning progress, favourites, and custom vocabulary are stored in the browser's LocalStorage.

## Included in this project

- **N5 Vocabulary:** All 1,027 entries from the supplied N5 Lesson 01–25 list, preserving lesson order and repeated entries. Every entry includes Japanese, Kanji where supplied, Romaji, English meaning, Bengali meaning, a Vocabulary Type/Topic, and one example sentence.
- **Kana-only examples:** Every N5 example sentence is written using Hiragana/Katakana (plus Japanese punctuation), with Romaji and English sentence meaning.
- **Lesson Based + Topic Based:** N5 vocabulary can be browsed by Lesson 01–25 or by type/topic. Search covers Japanese, Kanji, Romaji, English, and Bengali.
- **N4 Vocabulary:** The user's own Lesson 26–30 list is included in full: 250 entries (46, 54, 53, 48, 49). The source list did not include Bengali translations or example sentences, so those are not fabricated in this build.
- **Grammar Lessons:** 25 original Bengali lesson notes covering the N5 lesson sequence, with patterns, explanations, and original example sentences.
- **Easy Grammar:** Quick-reference rules across verb forms, particles, adverbs, and connectors.
- Quiz and practice, progress tracking, light/dark mode, responsive layout, and HashRouter for static hosting.
- GitHub Actions workflow for GitHub Pages deployment.

## N5 lesson vocabulary counts

| Lesson | Words | Lesson | Words | Lesson | Words |
|---:|---:|---:|---:|---:|---:|
| 01 | 48 | 10 | 48 | 19 | 30 |
| 02 | 47 | 11 | 59 | 20 | 29 |
| 03 | 45 | 12 | 48 | 21 | 41 |
| 04 | 59 | 13 | 40 | 22 | 24 |
| 05 | 55 | 14 | 40 | 23 | 28 |
| 06 | 53 | 15 | 27 | 24 | 18 |
| 07 | 47 | 16 | 48 | 25 | 17 |
| 08 | 61 | 17 | 37 | **Total** | **1,027** |
| 09 | 50 | 18 | 28 | | |

## Run locally

Requires Node.js 22 LTS (or a compatible current LTS release).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

## Production build

```bash
npm run build
npm run preview
```

The static output is created in `dist/`.

## GitHub Pages

Set the repository's GitHub Pages source to **GitHub Actions**. Update `base` in `vite.config.js` if the repository name differs from the configured project path, then push to the `main` branch.

## Notes

- Audio uses the browser's SpeechSynthesis Japanese voice when available; it is not prerecorded native audio.
- No backend, account, or database is required.
- LocalStorage data is stored in the current browser profile.
- Built-in vocabulary is bundled with the website. The Add New Word dialog saves user-added entries under `na-custom-words` in LocalStorage and merges them into the visible vocabulary list.
