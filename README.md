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
          # optional, string to connect to Postgres DB. Defaults to 'postgres://postgres:pass@localhost:5432/postgres?sslmode=disable'
          dsn: '${{ secrets.CLOUDQUERY_DSN }}'
          # optional, defaults to aws
          provider: aws
          # optional, defaults to latest. Must be a valid SemVer version (e.g. v0.22.9) or latest
          version: latest
          # optional, defaults to "*". Comma separated list of resources to fetch. Use an empty string to skip fetching
          fetch_resources: '*'
```
