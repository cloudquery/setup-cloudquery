import * as core from '@actions/core';
import { platform } from 'os';
import { execaCommand } from 'execa';
import semver from 'semver';

const binaries = {
  darwin: 'brew install cloudquery/tap/cloudquery',
  linux: 'brew install cloudquery/tap/cloudquery',
};

export const installBinary = async () => {
  const binary = binaries[platform() as keyof typeof binaries];
  if (!binary) {
    throw new Error(`Unsupported platform: ${platform()}`);
  }
  await execaCommand(binary);
};

async function main() {
  try {
    const version = core.getInput('version', { required: false });
    if (!semver.valid(version)) {
      throw new Error(`Invalid version: ${version}`);
    }
    await installBinary();
  } catch (err) {
    const error = err as Error;
    core.error(error);
    core.setFailed(error.message);
  }
}

main();
