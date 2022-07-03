# setup-cloudquery

A GitHub action to download the CloudQuery CLI so it can be used in other steps.

## Prerequisites

* We only support Linux or MacOS runners. Contributions welcomed to add Windows support 🪟
* A CloudQuery configuration file present in the repository the action will be triggered from.

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
      # Check out a git repository with a pre-existing `cloudquery.yml` configuration file
      - uses: actions/checkout@v3

      # Setup AWS credentials (example)
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          role-to-assume: <role-arn>
          aws-region: <region>

      - uses: cloudquery/setup-cloudquery@v1
        name: Setup CloudQuery
        with:
          # optional, defaults to latest. Must be a valid SemVer version (e.g. v0.22.9) or latest
          version: latest

      - name: Fetch with CloudQuery
        run: cloudquery fetch --config cloudquery.yml

      # Upload logs as a GitHub actions artifact
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: 'cloudquery.log'
          path: 'cloudquery.log'
```
