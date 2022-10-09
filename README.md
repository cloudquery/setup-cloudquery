# setup-cloudquery

A GitHub action to download the CloudQuery CLI so it can be used in other steps.

## Prerequisites

- We only support Linux or MacOS runners. Contributions welcomed to add Windows support 🪟
- CloudQuery source and destination configuration files. See [CloudQuery docs](https://www.cloudquery.io/docs/quickstart) for more information.

> Visit [our getting started guide](https://docs.cloudquery.io/docs/getting-started/getting-started-with-aws/) to learn how to generate a configuration file.

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
      # Checkout a git repository with a pre-existing `cloudquery.yml` configuration file
      - uses: actions/checkout@v3

      # Setup AWS credentials (example)
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          role-to-assume: <role-arn>
          aws-region: <region>

      - uses: cloudquery/setup-cloudquery@v2
        name: Setup CloudQuery
        with:
          # optional, defaults to latest. Must be a valid SemVer version (e.g. v1.0.0) or latest
          version: latest

      - name: Sync with CloudQuery
        run: cloudquery sync [file or directories...]

      # Upload logs as a GitHub actions artifact
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: 'cloudquery.log'
          path: 'cloudquery.log'
```
