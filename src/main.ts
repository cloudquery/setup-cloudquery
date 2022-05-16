import path from 'path';
import { promises as fs } from 'fs';
import * as core from '@actions/core';

import { getConfig } from './config.js';
import { getInstaller } from './install.js';
import { initProvider, fetch as runFetch } from './cloudquery.js';

const DEFAULT_DSN =
  'postgres://postgres:pass@localhost:5432/postgres?sslmode=disable';

async function main() {
  try {
    const { version, dsn, provider, resources } = await getConfig();

    await getInstaller()(version);
    await initProvider(provider);

    // TODO: Once cloudquery supports configuring the dsn, we can remove this workaround
    const configPath = path.resolve('config.hcl');
    const config = await fs.readFile(configPath, 'utf8');
    const withDsn = config.replace(DEFAULT_DSN, dsn);
    await fs.writeFile(configPath, withDsn);

    if (resources.length > 0) {
      const resourcesString = resources.some((resource) => resource === '*')
        ? `resources = [ "*" ]`
        : `resources = ${resources
            .map((resource) => `"${resource}"`)
            .join(',')}`;
      const withResources = withDsn.replace(DEFAULT_DSN, resourcesString);
      await fs.writeFile(configPath, withResources);
      await runFetch();
    }
  } catch (err) {
    const error = err as Error;
    core.error(error);
    core.setFailed(error.message);
  }
}

main();
