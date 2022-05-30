import semver from 'semver';
import * as core from '@actions/core';

import { pathExists } from 'path-exists';
import { isFile } from 'path-type';

export const getConfig = async () => {
  const version = core.getInput('version', { required: false });
  if (version !== 'latest' && !semver.valid(version)) {
    throw new Error(`Invalid version: ${version}`);
  }

  const [configPath, additionalFlags] = [
    core.getInput('config_path', { required: false }) || 'config.hcl',
    core.getInput('additional_flags', { required: false }) || '',
  ];

  const exists = await pathExists(configPath);
  if (!exists) {
    throw new Error(`Config file does not exist: ${configPath}`);
  }

  const file = await isFile(configPath);
  if (!file) {
    throw new Error(`Path to config must be a valid file: ${configPath}`);
  }

  return {
    version,
    additionalFlags: `--config ${configPath} ${additionalFlags}`,
  };
};
