import { execaCommand } from 'execa';
import * as core from '@actions/core';

export const fetch = async (additionalFlags: string) => {
  core.info(`Running fetch`);
  await execaCommand(`./cloudquery fetch ${additionalFlags}`, {
    stdout: 'inherit',
  });
  core.info(`Fetch completed`);
};
