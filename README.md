# setup-cloudquery-action

**WORK IN PROGRESS AND MIGHT BE DEPRECATED, SEE [ISSUE](https://github.com/cloudquery/cloudquery-issues/issues/143)**

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
      # Setup AWS credentials (example)
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          role-to-assume: <role-arn>
          aws-region: <region>

      - uses: cloudquery/setup-cloudquery@v1
        with:
          # optional, Path to CloudQuery config file. Defaults to `config.hcl`
          config_path: 'config.hcl'
          # optional, defaults to latest. Must be a valid SemVer version (e.g. v0.22.9) or latest
          version: latest
          # additional_flags, defaults to an empty string. Additional flags to pass to CloudQuery CLI
          additional_flags: ''
```

For a complete example on how to use this action to parallelize CloudQuery across multiple machines, see [here](./.github/workflows/example.yml#L22)
