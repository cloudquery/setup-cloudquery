import { execaCommand } from 'execa';

export const initProvider = async (provider) => {
  await execaCommand(`./cloudquery init ${provider}`, {
    stdout: 'inherit',
  });
};

export const fetch = async () =>
  await execaCommand(`./cloudquery fetch`, {
    stdout: 'inherit',
  });
