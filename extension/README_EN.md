# NostalgicTube 0.2.1

The **Donate with Ko-fi** icon at the bottom-right of the popup opens https://ko-fi.com/yomidee in a new tab. Its label follows the selected interface language.

A native YouTube home feed mixing your saved interests with discoveries from an earlier era. English is the default interface language. Click the **English / Español slider switch** in the popup to toggle languages; Space and Enter also work when focused. The selection is saved automatically and updates open YouTube tabs without changing the current video mix.

## Install in Brave

1. Disable earlier YouTube Antes or NostalgicTube versions at `brave://extensions`.
2. Extract the ZIP into a permanent folder.
3. Enable **Developer mode**, choose **Load unpacked**, and select the **NostalgicTube** folder containing `manifest.json`.
4. Reload your YouTube tabs. Search for a few interests, then return to the home page. You can also add interests manually in the popup.

To update an existing installation while preserving its interests, replace the files in its original folder with these files, click **Reload** on its extension card, and reload YouTube. Keep the folder in place.

## Controls

- Saves up to 40 distinct YouTube searches from installation in local extension storage; no access to previous browser or account history.
- Samples up to four interests per mix, with equal weight rather than favoring the most recent one.
- Defaults to approximately 75% interest-based videos and 25% discoveries. Choose 0%, 25%, or 50% discoveries in the popup. Availability may change the final proportion.
- **Another mix** rotates topics and results. Each batch adds up to 24 videos, excluding duplicates across the entire feed.
- Approaching the bottom automatically loads another batch. A spinning circle appears above **More videos** while loading. Previous cards remain in place.
- Later batches vary interests, years and searches. If no new videos are found or requests fail, automatic loading pauses; the button lets you retry. Availability is finite and depends on YouTube results.
- **My interests** lets you add, delete, or clear topics and pause automatic learning.
- Defaults to videos before January 1, 2022. Discovery searches cover the preceding five calendar years and favor videos with at least 100,000 current views. This approximates well-known videos from that era; current views cannot establish their exact historical popularity.

## Privacy and limitations

Uses only `storage` permission and content scripts on `https://www.youtube.com/*`. Sends search queries to YouTube using that session, with no developer server or telemetry. At most six searches per generation, two concurrently, with a temporary in-tab cache. Native YouTube cards retain YouTube's own interactions and requests.

Depends on YouTube's internal markup and components, which may change. Dates shown as relative ages are approximate. Unknown or ambiguous dates are excluded. Consent screens, throttling, or failed searches may limit results. Does not guarantee that older videos contain no AI content. UI language does not translate video titles or change YouTube's own language settings.

Version 4.2 was tested installed in a separate Brave profile against real YouTube: scrolling grew the feed from 24 to 48 cards, without duplicates or replacing the first DOM card. The loading indicator, a maximum of two concurrent requests, the language slider with click/keyboard, persistence, and disabling the panel were verified. Independent MIT-licensed project, not affiliated with YouTube or Brave.
