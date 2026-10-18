# Testing and evidence

## Portable checks in this repository

Run `node --test tests/*.test.cjs` for date interpretation, keyword extraction, mixing/duplicate behavior, random-date plans, translations and manifest asset references. Run `python scripts/package.py` to produce an installable archive from `extension/`.

These checks do not require network access or a real YouTube account. CI runs the same checks. Passing them does not validate every current YouTube UI variant.

## Development-session evidence

During development, isolated Brave profiles were used for real MV3 installation. Selected checks included real YouTube native-card rendering, 24-to-48-card append behavior without duplicates, language switching and autosave persistence. Other checks used **simulated YouTube search pages/results or playback**: recommendation proportions, zero/one-view eligibility, title-learning thresholds, retry recovery, reset generation and before: enforcement.

The original session scripts contain environment-specific browser/runtime paths and are intentionally not presented as portable tests. They are not included along with browser profiles or cached account data.

Current popup screenshots were captured using the installed extension in a separate empty test profile. No personal browsing history or private account information appears in them.

## Manual release checklist

1. Load `extension/` in a separate Brave profile.
2. Verify popup, both languages, settings persistence, reset and the donation link destination.
3. Search YouTube and check exactly one configured before: operator.
4. Check related mode and Random. Confirm that view counts do not determine eligibility.
5. Scroll and verify append without duplicates or resetting the first card.
6. Exercise empty/failing sources and cancel while a retry is pending.
7. Verify video learning with visible playback and disabling the option.
8. Verify that turning the extension off restores the native home feed.
9. Keep autoplay out-of-scope limitations explicit in release notes.
