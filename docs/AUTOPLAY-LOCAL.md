# Autoplay local test — 0.8.37

This optional feature is disabled by default. Enable “Nostalgic autoplay” in the extension popup, open a regular YouTube video and wait for NostalgicTube's recommendations to load. At the end, a card inside the upper-right corner of the player shows the first eligible old recommendation with its thumbnail, title, a ten-second countdown, Play now and Cancel.

While enabled on a supported watch page, it turns off YouTube's native autoplay only after reading its actual toggle state. If that state cannot be confirmed, it does not navigate automatically. Turning the feature off restores native autoplay only if this feature changed it. A fresh setting key prevents discarded earlier experiments from enabling it unexpectedly.

No action is taken for playlists, live videos, ads, looping playback, hidden tabs, fullscreen or picture-in-picture at the end of playback. Cancelling, starting playback again, navigating, changing the candidate or disabling the feature cancels the countdown. If no verifiably old candidate is ready when playback ends, playback stops.

43 automated tests pass. A browser fixture verifies the player overlay, Cancel and native toggle restoration. The fixture uses a simulated player, not YouTube. Actual Brave/YouTube behavior still needs user testing. Refresh the extension in brave://extensions and reload YouTube before testing.

Publication is pending. Version-history renumbering is also pending and has not changed GitHub's published releases.


