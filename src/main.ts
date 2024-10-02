import * as core from '@actions/core';
import fetch from 'node-fetch';
import chalk from 'chalk';
import { platform, arch } from 'os';
import { execaCommand } from 'execa';
import ora from 'ora';
import semver from 'semver';
import path from 'path';
import pWaitFor from 'p-wait-for';

const binaries = {
  darwin_arm64: 'cloudquery_darwin_arm64',
  darwin_x64: 'cloudquery_darwin_amd64',
  linux_arm64: 'cloudquery_linux_arm64',
  linux_x64: 'cloudquery_linux_amd64',
};

const resolveDownloadUrl = async (version: string, binary: string) => {
  const tag = version.startsWith('v') ? `cli-${version}` : `cli-v${version}`;
  return `https://github.com/cloudquery/cloudquery/releases/download/${tag}/${binary}`;
};

const assetExists = async (url: string) => {
  try {
    core.debug(`Checking if ${url} exists`);
    const response = await fetch(url, { redirect: 'follow' });
    core.debug(`Response status: ${response.status}`);
    core.debug(`Response statusText: ${response.statusText}`);
    core.debug(`Response ok: ${response.ok}`);
    const ok = response.ok;
    if (!ok) {
      core.info(`${url} does not exist, retrying...`);
    }
    return ok;
  } catch (error) {
    core.error(error as Error);
    return false;
  }
};

export const installBinary = async (version: string) => {
  const binaryKey = (platform() + '_' + arch()) as keyof typeof binaries;
  const binary = binaries[binaryKey];
  if (!binary) {
    throw new Error(`Unsupported platform: ${platform()}`);
  }
  const message = `version '${chalk.green(version)}'`;
  const spinner = ora(`Downloading ${message} of CloudQuery`).start();
  const downloadUrl = await resolveDownloadUrl(version, binary);
  await pWaitFor(() => assetExists(downloadUrl), {
    interval: 5000,
    timeout: 60000,
  });
  await execaCommand(`curl -L ${downloadUrl} -o cloudquery`, {
    stdout: 'inherit',
  });
  await execaCommand('chmod +x cloudquery');
  core.addPath(path.resolve('./'));
  spinner.succeed(`Finished downloading ${message} of CloudQuery`);
};

async function main() {
  try {
    const version = core.getInput('version', { required: false });
    if (!semver.valid(version)) {
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
