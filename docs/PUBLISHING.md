# Publishing plan

This local repository is ready for a new GitHub repository named NostalgicTube. No remote is configured until an account is authorized and the destination is verified. Never put passwords or access tokens in this repository or the conversation.

1. Confirm the GitHub account/repository destination through the authorized connection.
2. Push main and the recovered version tags. The commits are archive imports, not fabricated original Git history.
3. Create **draft** releases for the recovered snapshots in releases/catalog.json, attaching their actual ZIP and matching release notes/checksum.
4. Mark historical snapshots as historical/prerelease, with 4.8.3 the current beta. Do not manufacture releases for documented-only milestones.
5. Review rendered README/screenshots and publish the prepared release set in the authorized repository.

GitHub integration authorization must be completed by the account owner. Do not upload browser profiles, scratch folders or the full development conversation. GitHub hosting is separate from Chrome Web Store distribution and does not enable automatic browser-extension updates.

Official GitHub reference: https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository
