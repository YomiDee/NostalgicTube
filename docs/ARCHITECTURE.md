# Architecture

| File | Responsibility |
| --- | --- |
| `extension/manifest.json` | MV3 declarations, icons, popup, worker and content-script worlds |
| `search-guard.js` | Enforce the cutoff on YouTube result URLs and search submissions |
| `content.js` | Page lifecycle, playback sampling, feed planning, fetch concurrency, pagination-by-query variation, duplicate prevention and retry scheduling |
| `background.js` | Serialize interest writes, enforce learning preferences and reset generations |
| `topics.js` | Local bilingual keyword heuristics and known-topic aliases |
| `search.js` | Defaults, query construction, initial-data parsing, renderer extraction and mixing |
| `dates.js` | Absolute/relative date parsing and conservative cutoff classification |
| `random.js` | Independent random queries and topic-preserving randomized date windows |
| `native.js` | MAIN-world bridge to YouTube's native rich-grid renderer |
| `i18n.js` | English and Spanish interface text |
| `popup.*` | Compact settings UI, autosave, reset and donation link |

The isolated content script handles extension settings and search requests. A narrowly scoped DOM bridge passes bounded renderer batches to the MAIN-world script, which sets native component data. This relies on YouTube internals rather than a public rendering API.

Interest writes are queued to avoid races between tabs. Reset increments `algorithmEpoch`; stale learning messages are ignored. Topic selection does not weight the latest search more heavily.

Requests are capped at two concurrent workers. Empty result batches trigger delayed new attempts with broader date windows, up to a one-minute pause and reduced source count after repeated failures. Hidden/offline tabs wait. Navigation, disabling or a new mix cancels pending work.

Date filtering is based on returned visible metadata, not a guaranteed exact upload timestamp. Autoplay and YouTube's native Up next queue are outside this extension's control.
