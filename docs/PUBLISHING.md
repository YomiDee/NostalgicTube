# Publication and future releases

The public repository is https://github.com/yomidee/NostalgicTube.

Main and all 14 recovered version tags are published. Each recovered snapshot has a public prerelease with its matching ZIP and release notes. Version 0.8.3 is the current beta; six additional milestones are documented without invented source snapshots or tags. Import commits use their real import timestamps rather than fabricated development dates.

For future releases:

1. Update the extension version, changelog and release notes.
2. Run the tests and scripts/package.py, then verify the resulting ZIP.
3. Commit the reviewed source and create its matching version tag.
4. Push main and the tag, check GitHub Actions, and publish a release with the verified ZIP.

Keep credentials, browser profiles, local interest data and the full development conversation out of the repository. GitHub hosting is separate from Chrome Web Store distribution and does not enable automatic browser-extension updates.

Official GitHub reference: https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository
