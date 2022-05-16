import semver from 'semver';
import pg from 'pg';
import * as core from '@actions/core';

export const getConfig = async () => {
  const version = core.getInput('version', { required: false });
  if (version !== 'latest' && !semver.valid(version)) {
    throw new Error(`Invalid version: ${version}`);
  }

  const dsn =
    core.getInput('dsn', { required: false }) ||
    'postgres://postgres:pass@localhost:5432/postgres?sslmode=disable';

  try {
    const client = new pg.Client(dsn);
    await client.connect();
    await client.end();
  } catch (err) {
    const error = err as Error;
    throw new Error(`Unable to connect to database: ${error.message}`);
  }

  const provider = core.getInput('provider', { required: false }) || 'aws';
  const fetchResources =
    core.getInput('fetch_resources', { required: false }) || '*';
  return {
    version,
    dsn,
    provider,
    resources: fetchResources
      .split(',')
      .map((resource) => resource.trim())
      .filter(Boolean),
  };
};
