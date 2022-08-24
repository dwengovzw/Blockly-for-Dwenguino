import fs from "fs/promises"
import os from "os"
import path from "path"

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

let teardown = async () => {
    // close the browser instance
  await globalThis.__BROWSER_GLOBAL__.close();

  // clean-up the wsEndpoint file
  await fs.rm(DIR, {recursive: true, force: true});
}

export default teardown;