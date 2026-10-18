# Changelog

All milestones below are recorded from the development conversation. Versions without preserved source are marked **documented only**. This is an imported project history, not a claim that every milestone had an original Git commit.

## 0.8.52

- Hide native watch recommendations before route detection during navigation.

## 0.8.51

- Refresh recommendations automatically after learning submitted searches or watched videos, including existing topics.

## 0.8.50

- Remove the More videos button and duplicate idle heading; retain automatic scroll loading.
- Center the home no-topic notice and its automatic-mix label.
- Keep the 0.8.37 generation method and other features unchanged.

## 0.8.37

- Set the optional autoplay countdown to 10 seconds.
- Update the documentation and release numbering consistently to the 0.x series.

## 0.8.36 (local iteration)

- Hide the before: cutoff operator in the visible YouTube search field while retaining it in actual search URLs.

## 0.8.35 (local iteration)

- Move the autoplay card into the upper-right corner of the player.

## 0.8.34 (local iteration)

- Add optional autoplay, disabled by default, using the first eligible old recommendation with Play now and Cancel.
- Pause/cancel on unsupported playback contexts and restore the original autoplay preference when applicable.

## 0.8.33

- Add an autosaved eight-language discovery search selector below Variety, localized in English and Spanish.
- Default to all languages, require at least one, and retain neutral camera searches.

## 0.8.32

- Prevent the initial native recommendation flash and hide watch chips during loading.
- Add a localized calendar with automatic year rollover.
- Broaden and interleave multilingual discovery searches; parse compact video ages.
- See release notes for the accumulated local changes since 0.8.23.

## 0.8.23

- Expand the loading messages to 28 bilingual phrases, randomly selected every five seconds without consecutive repetition.

## 0.8.22

- Simplify loading to one heading without trailing dots.
- Add 14 rotating bilingual loading jokes and remove duplicate loading/progress text.
- Keep the existing search and retry behavior.

## 0.8.21

- Add horizontal watch-page recommendation cards, larger thumbnails and native-list hiding when replacement cards are ready.
- Remove loaded-count status and position the home mix label below the toolbar.
- Consolidate local-only iterations 0.8.14–0.8.20; supersede the initial broken thumbnail experiment.

## 0.8.13

- Bound each YouTube source request to 8 seconds and each batch to 18 seconds instead of 45. Finish early once enough unique eligible videos are available to meet the requested mix. Keep two workers and longer backoff for network/rate-limit failures; retry empty searches sooner and distinguish their status messages. Tests use simulated responses; real network speed and YouTube availability are not guaranteed.

## 0.8.12

- Show Check for updates beside the installed version. On click, compare against the newest published release version, including betas: Up to date! if current, Check GitHub to update! if older. The latter opens the release page. Failed checks remain retryable and do not claim that the version is current.

## 0.8.11

- Replace update detection with a direct Check GitHub to update! link to the repository releases. No API checks, automatic downloads or GitHub host permission.

## 0.8.10

- Simplify update checks to compare release tag versions. Show Up to date! when current, or Update it! linking to the GitHub release page when older. Do not initiate ZIP downloads. If verification fails, keep a neutral Check updates link to GitHub without claiming the installation is current.

## 0.8.9

- Shorten the current-version status to Up to date! / ¡Al día!.

## 0.8.8

- Display version and update status on one line. Use You have the latest version! / ¡Tienes la última versión! for the current-version status.

## 0.8.7

- Center the official logo and tagline above the popup controls, retaining the compact layout and footer positions.

## 0.8.6

- Show Already updated / Ya está actualizada when the installed version is current. Automatically check on popup opening after optional permission has been granted. Explain connection failures and GitHub rate limits without implying that the installation is outdated.

## 0.8.5

- Add on-demand GitHub release checks, bilingual status and validated ZIP download links.
- Request optional GitHub access only when checking; do not send interests or settings.
- Explain the manual replacement/reload required for unpacked installations.

## 0.8.4

- Display the installed version at the bottom left of the popup, read directly from the manifest.

## 0.8.3
Autosave settings; remove Save button and reject invalid cutoff values.
Recovered source and installable ZIP available.

## 0.8.2
Ko-fi footer with exclamation mark and punctuated bilingual taglines.
**Documented only:** this workspace no longer contains an exact standalone source snapshot or ZIP for this milestone.

## 0.8.1
Official rounded triangular red N toolbar icon.
**Documented only:** this workspace no longer contains an exact standalone source snapshot or ZIP for this milestone.

## 0.8.0
Official transparent logo and compact dark popup without internal scrolling.
Recovered source and installable ZIP available.

## 0.7.0
Automatic empty-batch recovery and continuous 0–100% Variety slider.
**Documented only:** this workspace no longer contains an exact standalone source snapshot or ZIP for this milestone.

## 0.6.0
Remove view-count preferences from every recommendation mode.
Recovered source and installable ZIP available.

## 0.5.0
100% Random, independent of learned interests and without view-count filtering.
**Documented only:** this workspace no longer contains an exact standalone source snapshot or ZIP for this milestone.

## 0.4.1
Wordmark/header layout, bilingual tagline and donation placement refinements.
**Documented only:** this workspace no longer contains an exact standalone source snapshot or ZIP for this milestone.

## 0.4.0
Automatic-only interests, reset, 10,000-topic capacity and before: search enforcement.
Recovered source and installable ZIP available.

## 0.3.3
Smooth rounded-square icon.
Recovered source and installable ZIP available.

## 0.3.2
Square badge with chamfered corners.
Recovered source and installable ZIP available.

## 0.3.1
First red white-N extension icon.
Recovered source and installable ZIP available.

## 0.3.0
Learn a topic from a video title after visible playback.
Recovered source and installable ZIP available.

## 0.2.1
Ko-fi donation link in the popup.
Recovered source and installable ZIP available.

## 0.2.0
Progressive scrolling, loading spinner and one-click language switch.
Recovered source and installable ZIP available.

## 0.1.0
English default and Spanish interface selection.
Recovered source and installable ZIP available.

## 0.0.4
Rename to NostalgicTube; accumulate interests and mix in discoveries.
**Documented only:** this workspace no longer contains an exact standalone source snapshot or ZIP for this milestone.

## 0.0.3
Render results with native YouTube grid and video cards.
Recovered source and installable ZIP available.

## 0.0.2
Generate related old-video recommendations instead of only filtering cards.
Recovered source and installable ZIP available.

## 0.0.1
Initial local date filter: hide, dim, fade and unknown-date handling.
Recovered source and installable ZIP available.
