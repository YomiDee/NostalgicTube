# Changelog

All milestones below are recorded from the development conversation. Versions without preserved source are marked **documented only**. This is an imported project history, not a claim that every milestone had an original Git commit.

## 4.8.13

- Bound each YouTube source request to 8 seconds and each batch to 18 seconds instead of 45. Finish early once enough unique eligible videos are available to meet the requested mix. Keep two workers and longer backoff for network/rate-limit failures; retry empty searches sooner and distinguish their status messages. Tests use simulated responses; real network speed and YouTube availability are not guaranteed.

## 4.8.12

- Show Check for updates beside the installed version. On click, compare against the newest published release version, including betas: Up to date! if current, Check GitHub to update! if older. The latter opens the release page. Failed checks remain retryable and do not claim that the version is current.

## 4.8.11

- Replace update detection with a direct Check GitHub to update! link to the repository releases. No API checks, automatic downloads or GitHub host permission.

## 4.8.10

- Simplify update checks to compare release tag versions. Show Up to date! when current, or Update it! linking to the GitHub release page when older. Do not initiate ZIP downloads. If verification fails, keep a neutral Check updates link to GitHub without claiming the installation is current.

## 4.8.9

- Shorten the current-version status to Up to date! / ¡Al día!.

## 4.8.8

- Display version and update status on one line. Use You have the latest version! / ¡Tienes la última versión! for the current-version status.

## 4.8.7

- Center the official logo and tagline above the popup controls, retaining the compact layout and footer positions.

## 4.8.6

- Show Already updated / Ya está actualizada when the installed version is current. Automatically check on popup opening after optional permission has been granted. Explain connection failures and GitHub rate limits without implying that the installation is outdated.

## 4.8.5

- Add on-demand GitHub release checks, bilingual status and validated ZIP download links.
- Request optional GitHub access only when checking; do not send interests or settings.
- Explain the manual replacement/reload required for unpacked installations.

## 4.8.4

- Display the installed version at the bottom left of the popup, read directly from the manifest.

## 4.8.3
Autosave settings; remove Save button and reject invalid cutoff values.
Recovered source and installable ZIP available.

## 4.8.2
Ko-fi footer with exclamation mark and punctuated bilingual taglines.
**Documented only:** this workspace no longer contains an exact standalone source snapshot or ZIP for this milestone.

## 4.8.1
Official rounded triangular red N toolbar icon.
**Documented only:** this workspace no longer contains an exact standalone source snapshot or ZIP for this milestone.

## 4.8.0
Official transparent logo and compact dark popup without internal scrolling.
Recovered source and installable ZIP available.

## 4.7.0
Automatic empty-batch recovery and continuous 0–100% Variety slider.
**Documented only:** this workspace no longer contains an exact standalone source snapshot or ZIP for this milestone.

## 4.6.0
Remove view-count preferences from every recommendation mode.
Recovered source and installable ZIP available.

## 4.5.0
100% Random, independent of learned interests and without view-count filtering.
**Documented only:** this workspace no longer contains an exact standalone source snapshot or ZIP for this milestone.

## 4.4.1
Wordmark/header layout, bilingual tagline and donation placement refinements.
**Documented only:** this workspace no longer contains an exact standalone source snapshot or ZIP for this milestone.

## 4.4.0
Automatic-only interests, reset, 10,000-topic capacity and before: search enforcement.
Recovered source and installable ZIP available.

## 4.3.3
Smooth rounded-square icon.
Recovered source and installable ZIP available.

## 4.3.2
Square badge with chamfered corners.
Recovered source and installable ZIP available.

## 4.3.1
First red white-N extension icon.
Recovered source and installable ZIP available.

## 4.3.0
Learn a topic from a video title after visible playback.
Recovered source and installable ZIP available.

## 4.2.1
Ko-fi donation link in the popup.
Recovered source and installable ZIP available.

## 4.2.0
Progressive scrolling, loading spinner and one-click language switch.
Recovered source and installable ZIP available.

## 4.1.0
English default and Spanish interface selection.
Recovered source and installable ZIP available.

## 4.0.0
Rename to NostalgicTube; accumulate interests and mix in discoveries.
**Documented only:** this workspace no longer contains an exact standalone source snapshot or ZIP for this milestone.

## 3.0.0
Render results with native YouTube grid and video cards.
Recovered source and installable ZIP available.

## 2.0.0
Generate related old-video recommendations instead of only filtering cards.
Recovered source and installable ZIP available.

## 1.0.0
Initial local date filter: hide, dim, fade and unknown-date handling.
Recovered source and installable ZIP available.
