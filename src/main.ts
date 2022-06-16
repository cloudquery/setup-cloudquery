import * as core from '@actions/core';
import chalk from 'chalk';

import { getConfig } from './config.js';
import { installBinary } from './install.js';
import { fetch as runFetch } from './cloudquery.js';

async function main() {
  try {
    core.info('Extracting inputs');
    const { version, additionalFlags } = await getConfig();

    core.info(`Installing version ${chalk.magenta(version)}`);
    await installBinary(version);

    return await runFetch(additionalFlags);
  } catch (err) {
    const error = err as Error;
    core.error(error);
    core.setFailed(error.message);
  }
}

main();
