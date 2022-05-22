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

      # Setup Azure credentials (example)
      - name: 'Configure Azure credentials'
        uses: azure/login@v1
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      # Setup GCP credentials (example)
      - name: 'Configure GCP credentials'
        uses: 'google-github-actions/auth@v0'
        with:
          workload_identity_provider: <identity-provider>
          service_account: <service-account>

      - uses: cloudquery/setup-cloudquery@v1
        with:
          # optional, defaults to 'postgres'
          db_user: postgres
          # optional, defaults to 'password'
          db_pass: '${{ secrets.DB_PASSWORD }}'
          # optional, defaults to 'localhost'
          db_host: localhost
          # optional, defaults to '5432'
          db_port: '5432'
          # optional, defaults to 'postgres'
          db_name: 'postgres'
          # optional, defaults to aws
          provider: aws
          # optional, defaults to latest. Must be a valid SemVer version (e.g. v0.22.9) or latest
          version: latest
          # optional, defaults to "*". Comma separated list of resources to fetch. Use an empty string to skip fetching
          fetch_resources: '*'
          # additional_flags, defaults to an empty string. Additional flags to pass to CloudQuery CLI
          additional_flags: ''
        env:
          # For sharding support, pass CI_NODE_INDEX and CI_NODE_TOTAL to only fetch a shard of the resources
          CI_NODE_INDEX: 0
          CI_NODE_TOTAL: 5
```
