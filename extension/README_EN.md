# NostalgicTube 4.4

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

Each batch samples up to four equally weighted interests and aims for 25% discoveries by default; choose 0%, 25%, or 50%. Availability can change the final ratio. Discoveries favor videos from the era with at least 100,000 current views, not a certified historical ranking.

**Another mix** starts a fresh feed. Near the bottom, a spinning circle and **More videos** appear while up to 24 new cards are appended, without duplicates across the feed. Empty or failed searches pause automatic loading and leave a retry button. Results are not unlimited.

English is the default. The **English / Español** slider switches languages with one click or the keyboard and saves automatically. It does not translate video titles or YouTube's own interface. The **Donate with Ko-fi** footer links to https://ko-fi.com/yomidee.

## Privacy and checks

Uses only `storage` and scripts on `www.youtube.com`. No access to previous browser/account history. Topics are local; search queries are sent to YouTube using that session. No developer server or telemetry. Topics are hidden from the UI, not encrypted from browser developer tools. At most two concurrent searches; temporary in-tab caching. YouTube format changes, consent screens, throttling, and approximate dates can limit results.

Version 4.4 was tested installed in a separate Brave profile with simulated pages: hidden/manual-free UI, retention beyond 1,000 topics, direct URL/Enter/SPA before: enforcement, cutoff updates, clean reset, and disabling. Native cards, scrolling, and languages were tested against real YouTube in previous versions.

Independent MIT-licensed project, not affiliated with YouTube or Brave.
