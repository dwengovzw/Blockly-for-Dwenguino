import {afterEach, afterAll, beforeEach, expect, jest, test, describe, beforeAll} from '@jest/globals'
import puppeteer from 'puppeteer'
import { startServer, endServer } from "../../../../util/start_server.js"
import { runAddRemoveComponentsWithScenarioSwitchRecording } from "../../actions/adding_removing_soc_robot_compontents_with_scenario_switch2.js"

const timeout = 5000;

jest.setTimeout(900000) // 15m



describe(
  '/ (Home Page)',
  () => {
    let page;
    let browser;
    beforeAll(async () => {
        await startServer();
        // Set a definite size for the page viewport so view is consistent across browsers
        //page = await globalThis.__BROWSER_GLOBAL__.newPage();
        browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox']});
        page = await browser.newPage();
        page.on("dialog", (d) => { d.accept(); }); // Accept all dialogs the page displays            
    }, timeout);

    beforeEach(async () => {
      //jest.useFakeTimers();
    });

    /*let testMessage = "Adding and removing each component from the social robot simulation should not result in errors";
    it(testMessage, async () => {
      let pageErrors = 0;
      // Register error message event handler to detect console errors
      page.on('pageerror', error => {
        pageErrors += 1;
        console.log(`ERROR IN REPLAY (${testMessage}):\n${error}`)
       });
      await runAddRemoveComponentsRecording(browser, page) // run the recording and wait until finished.
      expect(pageErrors).toBe(0); // Assert that there will not be any errors
    });*/

    let testMessage = "Adding and removing each component from the social robot simulation and switching the scenario in between should not result in errors";
    it(testMessage, async () => {
      let pageErrors = 0;
      // Register error message event handler to detect console errors
      page.on('pageerror', error => {
        pageErrors += 1;
        console.log(`ERROR IN REPLAY (${testMessage}):\n${error}`)
       });
      await runAddRemoveComponentsWithScenarioSwitchRecording(browser, page) // run the recording and wait until finished.
      expect(pageErrors).toBe(0); // Assert that there will not be any errors
    });

    afterAll(async () => {
      browser.close()
      await endServer();
    })
  },
  timeout,
);