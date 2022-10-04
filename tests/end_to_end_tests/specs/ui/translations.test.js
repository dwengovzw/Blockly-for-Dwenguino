import {afterEach, afterAll, beforeEach, expect, jest, test, describe, beforeAll} from '@jest/globals'
import puppeteer from 'puppeteer'
import {connectDb, dropDb } from "../../../util/db_connection.js"
import http from 'http';
import { app } from "../../../../backend/server.js"
import { startServer, endServer } from "../../../util/start_server.js"
import { runDEToolboxRecording } from "../../actions/error_test.js"
import { runNLToolboxRecording } from "../../actions/toolbox_menu_without_errors_nl.js"

/*describe('DE toolbox check', () => {
    beforeAll(async () => {
        await connectDb();
        await dropDb();
        const httpServer = http.createServer(app)
        httpServer.listen(12032, () => {
            console.info("Test server is listening")
        })
        await page.goto('localhost:12032')
    })
})*/

const timeout = 5000;

jest.setTimeout(60000) // 60s

describe(
  '/ (Home Page)',
  () => {
    let page;
    let browser;
    beforeAll(async () => {
        await startServer();
        // Set a definite size for the page viewport so view is consistent across browsers
        //page = await globalThis.__BROWSER_GLOBAL__.newPage();
        browser = await puppeteer.launch();
        page = await browser.newPage();        
    }, timeout);

    let runDEToolboxRecordingWithoutErrors = "All toolbox menus in German open without errors";
    it(runDEToolboxRecordingWithoutErrors, async () => {
      let pageErrors = 0;
      // Register error message event handler to detect console errors
      page.on('pageerror', error => {
        console.log(`Test ${runDEToolboxRecordingWithoutErrors} had an error message:\n${error.message}`);
        pageErrors += 1;
       });
      await runDEToolboxRecording(browser, page) // run the recording and wait until finished.
      expect(pageErrors).toBe(0); // Assert that there will not be any errors
    });

    let runNLToolboxRecordingWithoutErrors = "All toolbox menus in Dutch open without errors";
    it(runNLToolboxRecordingWithoutErrors, async () => {
      let pageErrors = 0;
      // Register error message event handler to detect console errors
      page.on('pageerror', error => {
        console.log(`Test ${runNLToolboxRecordingWithoutErrors} had an error message:\n${error.message}`);
        pageErrors += 1;
       });
      await runNLToolboxRecording(browser, page) // run the recording and wait until finished.
      expect(pageErrors).toBe(0); // Assert that there will not be any errors
    });

    afterAll(async () => {
      browser.close()
      await endServer();
    })
  },
  timeout,
);