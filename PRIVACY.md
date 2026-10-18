# Privacy

NostalgicTube runs locally as a desktop browser extension. It has no developer-operated server, analytics or telemetry.

## Local data

- Settings, language, cutoff and up to 10,000 deduplicated interests are stored in `chrome.storage.local`.
- Search learning reads new queries on YouTube result pages, not your previous account/browser history.
- Video learning analyzes the title locally after 12 seconds of actual visible playback. It does not store complete titles or a persistent list of watched videos.
- Up to 200 processed video IDs and a short-lived result cache are kept in tab memory to prevent repeated processing. They disappear on reload or closure.
- Interests are hidden from the popup UI, not encrypted against the browser's developer tools.

**Clear all interests** resets learned topics and the learning generation, preserving settings. Disabling learning stops new automatic additions; uninstalling the extension removes its local storage.

## Network requests

Feed-generation searches are sent directly to YouTube without account-session cookies. Thumbnails and native components use YouTube infrastructure. Queries contain a topic or independent random seed and date operators. Search-result generation is not an offline process.

Normal navigation/searches use the browser's ordinary YouTube session. Native YouTube cards retain YouTube's own behavior and network activity. The optional donation link opens Ko-fi only when clicked.

## Permissions

Only `storage` is requested. Content scripts are restricted to `https://www.youtube.com/*`. There is no browser-history permission or access to unrelated sites. No model/API key is required.

This describes the current source, not third-party platform policies or all historical prototypes.

## Optional update checks (4.8.5 and later)

The popup checks GitHub releases when you press Check updates, or when you open the popup after previously granting optional access to api.github.com. The request goes to the public yomidee/NostalgicTube releases endpoint without account cookies; no interests, searches or settings are sent. GitHub receives ordinary network metadata such as your IP address. Clicking Download opens the matching GitHub release ZIP. No remote extension code is executed and installed files are not replaced automatically.
