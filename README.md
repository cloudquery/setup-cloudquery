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
        uses: aws-actions/configure-aws-credentials@7474bc4690e29a8392af63c5b98e7449536d5c3a # v4
        with:
          role-to-assume: <role-arn>
          aws-region: <region>

      - uses: cloudquery/setup-cloudquery@2620adc39fb9c21dfbbd5a5ab12d2520fb710429 # v5.0.1 # x-release-please-version
        name: Setup CloudQuery
        with:
          # Required. Must be a valid SemVer version
          version: 'v6.35.4'

      - name: Sync with CloudQuery
        run: cloudquery sync [file or directories...] --log-console
```
