# setup-cloudquery

A GitHub action to download the CloudQuery CLI so it can be used in other steps.

## Prerequisites

- We only support Linux or MacOS runners. Contributions welcomed to add Windows support 🪟
- CloudQuery source and destination configuration files. See [CloudQuery docs](https://www.cloudquery.io/docs/quickstart) for more information.

## Setup

Example usage:

Create a `.github/workflows/cloudquery.yml` file with the content of:

```yaml
name: CloudQuery
on:
  schedule:
    # Run daily at 03:00 (3am)
    - cron: '0 3 * * *'

jobs:
  cloudquery:
    runs-on: ubuntu-latest
    steps:
      # Checkout a git repository with a pre-existing CloudQuery configuration files
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6

      # Setup AWS credentials (example)
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@ec61189d14ec14c8efccab744f656cffd0e33f37 # v6
        with:
          role-to-assume: <role-arn>
          aws-region: <region>

      - uses: cloudquery/setup-cloudquery@b7f7ea62cfec9774ad44a0d9307d0f6c5573bcb6 # v5.0.2 # x-release-please-version
        name: Setup CloudQuery
        with:
          # Required. Must be a valid SemVer version
          version: 'v6.35.7'

      - name: Sync with CloudQuery
        run: cloudquery sync [file or directories...] --log-console
```
