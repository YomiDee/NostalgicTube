<p align="center"><img src="extension/assets/logo.png" alt="NostalgicTube" width="280"></p>

<p align="center"><strong>Enjoy what it used to be.</strong></p>
<p align="center">A nostalgic YouTube feed for Brave and desktop Chromium browsers.</p>
<p align="center"><a href="docs/README.es.md">Español</a> · <a href="CHANGELOG.md">Changelog</a> · <a href="docs/HISTORY.md">Project history</a> · <a href="PRIVACY.md">Privacy</a> · <a href="https://ko-fi.com/yomidee">Donate with Ko-fi!</a></p>

**Current version: 4.8.3 · Beta · Manifest V3**

NostalgicTube generates a feed of videos uploaded before your chosen date, using native YouTube cards. It learns interests locally and mixes related videos with unrelated discoveries. By default the cutoff is January 1, 2022.

## Features

- Continuous **0–100% Variety**: your topics at 0%, independent Random at 100%.
- No minimum view count or popularity sorting in any mode: zero-view videos are eligible too.
- Automatic learning from YouTube searches and, after 12 seconds of visible playback, video-title keywords.
- Up to 10,000 locally stored interests, managed automatically; **Clear all interests** resets learning.
- Native cards, duplicate prevention across the feed and progressive loading while scrolling.
- Automatic recovery from empty batches, with backoff rather than repeated manual retries.
- Automatic `before:YYYY-MM-DD` enforcement on YouTube search URLs, including searches opened from browser shortcuts or bookmarks.
- English by default, Spanish available, compact dark popup, automatic settings saving.

## Install in Brave

1. Download [NostalgicTube 4.8.3 ZIP](releases/NostalgicTube-4.8.3-Brave.zip) and extract it into a permanent folder.
2. Open `brave://extensions` and enable **Developer mode**.
3. Choose **Load unpacked** and select the extracted **NostalgicTube** folder containing `manifest.json`.
4. Reload YouTube tabs. Disable older copies of this extension to avoid interference.

If cloning this repository, load its **extension/** folder instead. No build step, account setup or API key is required.

To update and preserve learning, replace the files in your existing installation folder, reload the extension and reload YouTube. Uninstalling first removes its local data.

## Preview

| English | Español |
| --- | --- |
| ![English popup](docs/screenshots/popup-en.png) | ![Spanish popup](docs/screenshots/popup-es.png) |

Screenshots show the current popup in a separate test profile, not a personal YouTube account.

## How it works

The extension reads YouTube search-result pages, extracts video metadata, checks approximate upload dates and mixes eligible results. Related searches use locally learned topics. Random searches use independent terms and randomized date windows. The native YouTube renderer draws the cards. See [architecture](docs/ARCHITECTURE.md).

## Practical limits

- Random is a random selection among returned search candidates, **not uniform sampling of YouTube's entire catalogue**. YouTube may still favor popular, regional or language-specific results.
- Relative ages are approximate. Unrecognized dates and ranges crossing the cutoff are excluded.
- **YouTube autoplay / Up next is not controlled.** It may select a newer video. A direct video URL is not blocked.
- Date enforcement applies to YouTube searches, not Google or Brave Search pages.
- YouTube's internal markup and components may change. Consent screens, throttling and unavailable results may prevent loading. Automatic retries cannot guarantee recovery.
- Older upload dates do not guarantee that a video contains no AI-generated material.

## Development

```sh
node --test tests/*.test.cjs
python scripts/package.py
```

Tests use Node's built-in runner; packaging uses only Python's standard library. The output ZIP is written to `dist/`. See [testing](docs/TESTING.md) and [contributing](CONTRIBUTING.md).

## History and releases

The original project evolved from **YouTube Antes** (a local filter) through related-video panels and native YouTube rendering into NostalgicTube. This repository imports the **actual preserved source snapshots**, with tags for recovered versions. All documented milestones appear in the changelog; missing historical ZIPs are explicitly identified, never fabricated. See the [archive inventory](docs/HISTORY.md) and [machine-readable release catalogue](releases/catalog.json).

## License and support

Code is distributed under the [MIT license](LICENSE); existing notices are preserved. See [asset provenance](docs/ASSETS.md) for the user-supplied branding and its processing history. Independent project, not affiliated with YouTube, Google or Brave.

[Donate with Ko-fi!](https://ko-fi.com/yomidee)
