import { readFile, writeFile } from 'fs/promises';
import { array, object, string, validate, type Infer } from 'superstruct';
import { getDataDir } from './dataDir';
import consts from '$lib/consts';

/** Path to config.json */
const CONFIG_JSON = `${getDataDir()}/config.json`;

/** Validator for config.json file */
export const ConfigJsonStruct = object({
  /** Name of the person to use within the website. */
  siteName: string(),
  /**
   * The groups to list on the main page, in the order in which they should
   * appear.
   *
   * Any groups not within this array will still be accessible through their
   * pages, but won't be shown on the main page.
   */
  listedGroups: array(string()),
  /** Version of server that last accessed the config.json */
  version: string(),
});

/** Main configuration for the portfolio, `config.json` */
export type ConfigJson = Infer<typeof ConfigJsonStruct>;

/** Return the configuration, stored in `/data/config.json` */
export async function getConfig(): Promise<ConfigJson> {
  const data = await readFile(CONFIG_JSON, { encoding: 'utf-8' });

  // Validate data
  const [err, parsed] = validate(JSON.parse(data), ConfigJsonStruct);
  if (err) {
    console.log('Error while parsing config.json');
    console.error(err);
    throw err;
  }

  return parsed;
}

/** Update the configuration, stored in `/data/config.json` */
export async function setConfig(newConfig: ConfigJson) {
  await writeFile(CONFIG_JSON, JSON.stringify(newConfig, undefined, 2));
}

/** Set up the default server configuration */
export async function initConfig() {
  await setConfig({
    siteName: 'My portfolio',
    listedGroups: [],
    version: consts.VERSION,
  });
}
