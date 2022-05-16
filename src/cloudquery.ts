import { execaCommand } from 'execa';
import { promises as fs } from 'fs';

export const initProvider = async (provider: string) => {
  await execaCommand(`./cloudquery init ${provider}`, {
    stdout: 'inherit',
  });
};

export const fetch = async () =>
  await execaCommand(`./cloudquery fetch`, {
    stdout: 'inherit',
  });

export const updateCredentials = async (
  config: string,
  db: Record<string, string | number>,
) => {
  // TODO: Once cloudquery supports configuring the dsn, we can remove this workaround
  let withCredentials = config;
  Object.entries(db).forEach(([key, value]) => {
    withCredentials = withCredentials.replace(
      new RegExp(`${key}.*=.*`),
      Number.isInteger(value) ? `${key} = ${value}` : `${key} = "${value}"`,
    );
  });
  return withCredentials;
};

export const updateResoruces = async (config: string, resources: string[]) => {
  const resourcesString = resources.some((resource) => resource === '*')
    ? `resources = [ "*" ]`
    : `resources = [ ${resources
        .map((resource) => `"${resource}"`)
        .join(',')} ]`;
  const withResources = config.replace(
    /resources = \[[\s\S]+?\]/gm,
    resourcesString,
  );

  return withResources;
};
