import * as core from '@actions/core';
import chalk from 'chalk';
import { platform } from 'os';
import { execaCommand } from 'execa';
import ora from 'ora';
import semver from 'semver';
import path from 'path';

const binaries = {
  darwin: 'cloudquery_darwin_x86_64',
  win32: 'cloudquery_windows_x86_64.exe',
  linux: 'cloudquery_linux_x86_64',
};

export const installBinary = async (version: string) => {
  const binary = binaries[platform() as keyof typeof binaries];
  if (!binary) {
    throw new Error(`Unsupported platform: ${platform()}`);
  }
  const isLatest = version === 'latest';
  const message = isLatest ? `${chalk.green('latest')} version` : `version '${chalk.green(version)}'`;
  const spinner = ora(`test Downloading ${message} of CloudQuery`).start();
  const downloadUrl = isLatest
    ? `https://github.com/cloudquery/cloudquery/releases/${version}/download/${binary}`
    : `https://github.com/cloudquery/cloudquery/releases/download/${version}/${binary}`;
  await execaCommand(`curl -L ${downloadUrl} -o cloudquery`, {
    stdout: 'inherit',
  });
  await execaCommand('chmod +x cloudquery');
  core.debug(path.resolve('./'));
  core.debug("debugging")
  core.addPath(path.resolve('./'));
  spinner.succeed(`Finished downloading ${message} of CloudQuery`);
};

async function main() {
  try {
    const version = core.getInput('version', { required: false });
    if (version !== 'latest' && !semver.valid(version)) {
      throw new Error(`Invalid version: ${version}`);
    }
    await installBinary(version);
  } catch (err) {
    const error = err as Error;
    core.error(error);
    core.setFailed(error.message);
  }
}

main();
