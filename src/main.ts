import { promises as fs } from 'fs';
import * as core from '@actions/core';
import chalk from 'chalk';

import { getConfig } from './config.js';
import { installBinary } from './install.js';
import { initProvider, fetch as runFetch, updateCredentials, getFetchResources } from './cloudquery.js';

async function main() {
  try {
    core.info('Extracting config');
    const { version, db, provider, resources, additionalFlags } = await getConfig();

    core.info(`Installing version ${chalk.magenta(version)}`);
    await installBinary(version);

    core.info(`Initializing provider ${chalk.magenta(provider)}`);
    // Remove existing config (useful for local environments)
    const configPath = 'config.hcl';
    await fs.unlink(configPath).catch(() => undefined);

    await initProvider(provider, additionalFlags);

    core.info(`Configuring credentials`);
    const config = await fs.readFile(configPath, 'utf8');
    const withCredentials = await updateCredentials(config, db as Record<string, string | number>);
    await fs.writeFile(configPath, withCredentials);

    if (resources.length > 0) {
      core.info(`Configuring resources`);
      const fetchResources = await getFetchResources(withCredentials, resources);
      await fs.writeFile(configPath, fetchResources);
      core.info(`Running fetch`);
      await runFetch(additionalFlags);
      core.info(`Fetch completed`);
    } else {
      core.info(`Skipping fetch`);
    }
  } catch (err) {
    const error = err as Error;
    core.error(error);
    core.setFailed(error.message);
  }
}

main();
