import semver from 'semver';
import pg from 'pg';
import * as core from '@actions/core';

export const getConfig = async () => {
  const version = core.getInput('version', { required: false });
  if (version !== 'latest' && !semver.valid(version)) {
    throw new Error(`Invalid version: ${version}`);
  }

  const dsn = core.getInput('dsn', { required: true });
  try {
    const client = new pg.Client(dsn);
    await client.connect();
    await client.end();
  } catch (error) {
    throw new Error(`Unable to connect to database: ${error.message}`);
  }

  const providers = core.getInput('providers', { required: false }).split(',');
  const fetch =
    core.getInput('fetch', { required: false }).toLocaleLowerCase() !== 'false';
  return { version, dsn, providers, fetch };
};
