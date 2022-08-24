import { readFile } from "fs/promises"
import os from "os"
import path from "path"
import puppeteer from "puppeteer"
import NodeEnvironment from "jest-environment-node"

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

class PuppeteerEnvironment extends NodeEnvironment {
    constructor(config){
        super(config);
    }

    async setup() {
        await super.setup();
        const wsEndpoint = await readFile(path.join(DIR, 'wsEndpoint'), 'utf8');
        if (!wsEndpoint) {
            throw new Error('wsEndpoint not found');
        }

        // connect to puppeteer
        this.global.__BROWSER_GLOBAL__ = await puppeteer.connect({
            browserWSEndpoint: wsEndpoint,
        });
    }

  async teardown() {
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

export default PuppeteerEnvironment;