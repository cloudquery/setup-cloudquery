import * as core from '@actions/core';
import chalk from 'chalk';
import { platform } from 'os';
import { execaCommand } from 'execa';
import ora from 'ora';
import semver from 'semver';
import path from 'path';
import got from 'got';

const binaries = {
  darwin: 'cloudquery_darwin_x86_64',
  linux: 'cloudquery_linux_x86_64',
};

const resolveLatestVersionTag = async () => {
  const manifest: { latest: string } = await got('https://versions.cloudquery.io/v1/cli.json').json();
  return manifest.latest;
};

const resolveDownloadUrl = async (version: string, binary: string) => {
  if (version === 'latest') {
    const latestTag = await resolveLatestVersionTag();
    return `https://github.com/cloudquery/cloudquery/releases/download/${latestTag}/${binary}`;
  }
  const tag = version.startsWith('v') ? `cli/${version}` : `cli/v${version}`;
  return `https://github.com/cloudquery/cloudquery/releases/download/${tag}/${binary}`;
};

export const installBinary = async (version: string) => {
  const binary = binaries[platform() as keyof typeof binaries];
  if (!binary) {
    throw new Error(`Unsupported platform: ${platform()}`);
  }
  const isLatest = version === 'latest';
  const message = isLatest ? `${chalk.green('latest')} version` : `version '${chalk.green(version)}'`;
  const spinner = ora(`Downloading ${message} of CloudQuery`).start();
  const downloadUrl = await resolveDownloadUrl(version, binary);
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
