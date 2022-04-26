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
    const { version, dsn, providers, fetch } = await getConfig();

    await getInstaller()(version);
    for (const provider of providers) {
      await initProvider(provider);
    }

    // TODO: Once cloudquery supports configuring the dsn, we can remove this workaround
    const configPath = path.resolve('config.hcl');
    const config = await fs.readFile(configPath, 'utf8');
    await fs.writeFile(configPath, config.replace(DEFAULT_DSN, dsn));

    if (fetch) {
      await runFetch();
    }
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

main();
