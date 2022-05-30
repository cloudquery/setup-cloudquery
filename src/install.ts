import { platform } from 'os';
import { execaCommand } from 'execa';
import ora from 'ora';
import chalk from 'chalk';

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
  const spinner = ora(`Downloading ${message} of CloudQuery`).start();
  const downloadUrl = isLatest
    ? `https://github.com/cloudquery/cloudquery/releases/${version}/download/${binary}`
    : `https://github.com/cloudquery/cloudquery/releases/download/${version}/${binary}`;
  await execaCommand(`curl -L ${downloadUrl} -o cloudquery`, {
    stdout: 'inherit',
  });
  await execaCommand('chmod +x cloudquery');
  spinner.succeed(`Finished downloading ${message} of CloudQuery`);
};
