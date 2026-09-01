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
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7

      # Setup AWS credentials (example)
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@cbe3b392738ccf3f987d68400dafcf4b0624a56c # v6
        with:
          role-to-assume: <role-arn>
          aws-region: <region>

      - uses: cloudquery/setup-cloudquery@757b19eb8496cf9e89a78de54f2c677253f54f6b # v5.0.3 # x-release-please-version
        name: Setup CloudQuery
        with:
          # Required. Must be a valid SemVer version
          version: 'v6.41.2'

      - name: Sync with CloudQuery
        run: cloudquery sync [file or directories...] --log-console
```
