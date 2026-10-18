# NostalgicTube 0.8.3

All settings save automatically when changed. The variety slider saves when released or adjusted with the keyboard. The Save button has been removed. Empty or invalid dates do not overwrite the stored cutoff.

Ko-fi appears at the bottom right as “Donate with Ko-fi!” / “Donar con Ko-fi!”. Both taglines end with a full stop. The popup still fits without internal scrolling.

The Brave toolbar icon uses the official rounded red triangle with a white N, with a transparent PNG background in 16, 32, 48 and 128 pixel sizes. The popup retains the complete official logo.

## Compact popup and official logo

The header now uses the official transparent PNG logo, replacing the previous separate icon and text. Its triangular symbol also identifies the extension in Brave. The dark popup background keeps the white wordmark readable.

Long explanatory paragraphs were removed from the popup, keeping language, enable, date, variety, three options, Save and reset. No internal scrolling. Visually reviewed in English (503px high) and Spanish with Random and a status message (549px), below Chromium's usual 600px popup height. Feed and learning features are unchanged.

## Automatic recovery and continuous Variety

**Variety** is now a **0–100% slider**, adjustable in 1% steps with mouse or keyboard; release the slider to save automatically. Zero uses your topics and 100 activates Random. Intermediate values target an approximate discovery ratio, carried across batches so small percentages can appear as you keep scrolling. Availability may alter the actual ratio.

Empty batches no longer require Try again or show “No verifiably old results found”. The extension automatically tries other queries and widens date windows, preserving the configured cutoff, date checks and existing cards. A spinner and automatic-search message remain visible while waiting.

Failed rounds use 2/5/15/30/60-second delays, reduce source count after repeated failures, and use the long delay for HTTP 403/429. Requests wait while hidden or offline and are cancelled on disable, navigation or a new mix/settings change. This cannot guarantee results if YouTube blocks requests or has no compatible videos. At 0% with no learned topics, a learning prompt replaces futile retries.

Tested installed in Brave with simulated responses: empty batch followed by automatic recovery, loading indicator, broader retry queries, slider at 37/38%, keyboard, persistence and cancellation on disable.

## View-neutral related recommendations

The **0%, 25% and 50%** modes now ignore view counts too: no minimum views, popularity sorting or view-based candidate trimming. Related queries retain your topics, randomize date windows from the first batch and shuffle candidates. Discoveries also use varied queries rather than terms such as “hits” or “viral”.

All internal feed requests omit YouTube account cookies. Related modes use locally learned topics; Random ignores them. YouTube can still favor popular videos in its search results, so this is not a uniform sample of every related video, but the extension applies no additional view preference.

Tested with the extension installed in Brave and simulated results: zero-view, one-view and 100-million-view candidates are eligible in all four modes, with 0/6/12/24 discoveries in a full 24-video batch.

## 100% — Random

The discovery selector now includes **100% — Random**. This mode ignores saved interests and does not regenerate when they change. It generates independent queries using varied multilingual terms, camera filename patterns and random date windows before your cutoff. Random requests omit session cookies, rather than using your YouTube account session.

No minimum views, popularity sorting or view-based candidate trimming is applied: videos with zero views and millions of views are equally eligible for the random selection stage. Cutoff checks, duplicate prevention, scrolling and **Another mix** still apply. Learning can continue for the other modes without influencing Random.

This is **not a uniform sample of YouTube's entire catalogue**. Only search results are available, and YouTube can favor popular videos, region or language. Zero-view videos are eligible but cannot be guaranteed in every batch; not every existing video has an equal chance of appearing.

Verified with the extension installed in Brave and simulated results: independent queries, no change when interests change, date windows, zero/one-view eligibility and translations. The wordmark is smaller, closer to the icon and bottom-aligned.

Native YouTube cards, automatic interest learning, discoveries from an earlier era, and progressive loading while scrolling.

## Install or update

Extract the ZIP into a permanent folder. Open `brave://extensions`, enable **Developer mode**, click **Load unpacked**, and select **NostalgicTube**, the folder containing `manifest.json`. Disable earlier versions.

To preserve learning, replace the files in the existing installation folder, click **Reload** on its extension card, and reload YouTube tabs. Uninstalling first deletes its data.

## Automatic interests

No interest list or manual add/edit controls are exposed in the popup or feed. The algorithm manages topics from searches and watched-video titles. **Clear all interests** resets learning while preserving settings, language, and cutoff. Pending learning messages from before the reset cannot restore cleared topics.

Stores up to **10,000 distinct topics** locally. Oldest entries are replaced only at that limit. Existing learning is retained when updating the same installation. Search learning and video learning are independent options. Video titles teach a keyword after 12 seconds of actual playback in a visible tab; pauses, large seeks, and detected ads do not count. Title extraction uses local heuristics, not a remote AI model, and can be imperfect. No persistent viewing-history list or full titles are stored.

## Automatic before: searches

When enabled, NostalgicTube adds the configured `before:YYYY-MM-DD` cutoff to YouTube result-page searches, including Enter in YouTube's search field and result URLs opened from the browser address bar, bookmarks, or custom search engines. Defaults to **before:2022-01-01**. Replaces earlier before: operators without duplicating them. Changing the cutoff updates the current search; disabling the extension stops enforcement.

The destination must be `https://www.youtube.com/results`. It does not alter Google, Brave Search, or other external engines. Incoming URLs can briefly load before being redirected. YouTube controls the actual results and date interpretation; this does not block direct access to newer videos. Internal feed-fetch queries keep their narrower date windows.

## Feed and settings

Standard modes sample up to four equally weighted interests and aim for 25% discoveries by default; choose 0%, 25%, or 50%, or choose **100% — Random** to ignore interests. Availability can change the final ratio. No mode uses a view-count threshold or popularity preference.

**Another mix** starts a fresh feed. Near the bottom, a spinning circle and **More videos** appear while up to 24 new cards are appended, without duplicates across the feed. Empty or failed searches retry automatically with pauses. Results are not unlimited.

English is the default. The **EN / ES** slider switches languages with one click or the keyboard and saves automatically. It does not translate video titles or YouTube's own interface. The **Donate with Ko-fi** link is at the bottom right and opens https://ko-fi.com/yomidee. The header shows the complete official logo. The tagline is “Enjoy what it used to be” in English and “Disfruta de lo que solía ser” in Spanish.

## Privacy and checks

Uses only `storage` and scripts on `www.youtube.com`. No access to previous browser/account history. Topics are local; search queries are sent to YouTube using that session. No developer server or telemetry. Topics are hidden from the UI, not encrypted from browser developer tools. At most two concurrent searches; temporary in-tab caching. YouTube format changes, consent screens, throttling, and approximate dates can limit results.

Version 4.4 was tested installed in a separate Brave profile with simulated pages: hidden/manual-free UI, retention beyond 1,000 topics, direct URL/Enter/SPA before: enforcement, cutoff updates, clean reset, and disabling. Native cards, scrolling, and languages were tested against real YouTube in previous versions.

Independent MIT-licensed project, not affiliated with YouTube or Brave.
