import path from 'path';
import { promises as fs } from 'fs';
import * as core from '@actions/core';

import { getConfig } from './config.js';
import { getInstaller } from './install.js';
import {
  initProvider,
  fetch as runFetch,
  updateCredentials,
  updateResoruces as updateResources,
} from './cloudquery.js';

async function main() {
  try {
    const { version, db, provider, resources } = await getConfig();

    await getInstaller()(version);
    // Remove existing config (useful for local environments)
    const configPath = path.resolve('config.hcl');
    await fs.unlink(configPath);

    await initProvider(provider);

    const config = await fs.readFile(configPath, 'utf8');
    const withCredentials = await updateCredentials(
      config,
      db as Record<string, string | number>,
    );
    await fs.writeFile(configPath, withCredentials);

    if (resources.length > 0) {
      const withResources = await updateResources(withCredentials, resources);
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
