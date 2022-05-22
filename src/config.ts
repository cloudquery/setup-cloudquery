import semver from 'semver';
import pg from 'pg';
import * as core from '@actions/core';

export const getConfig = async () => {
  const version = core.getInput('version', { required: false });
  if (version !== 'latest' && !semver.valid(version)) {
    throw new Error(`Invalid version: ${version}`);
  }

  const [username, password, host, port, database, additionalFlags] = [
    core.getInput('db_user', { required: false }) || 'postgres',
    core.getInput('db_pass', { required: false }) || 'pass',
    core.getInput('db_host', { required: false }) || 'localhost',
    parseInt(core.getInput('db_port', { required: false }) || '5432'),
    core.getInput('db_name', { required: false }) || 'postgres',
    core.getInput('additional_flags', { required: false }) || '',
  ];

  try {
    const dns = `postgres://${username}:${password}@${host}:${port}/${database}?sslmode=disable`;
    const client = new pg.Client(dns);
    await client.connect();
    await client.end();
  } catch (err) {
    const error = err as Error;
    throw new Error(`Unable to connect to database: ${error.message}`);
  }

  const provider = core.getInput('provider', { required: false }) || 'aws';
  const fetchResources = core.getInput('fetch_resources', { required: false }) || '*';
  return {
    version,
    db: {
      username,
      password,
      host,
      port,
      database,
    },
    provider,
    resources: fetchResources
      .split(',')
      .map((resource) => resource.trim())
      .filter(Boolean),
    additionalFlags,
  };
};
