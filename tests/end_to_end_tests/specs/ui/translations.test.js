import {afterEach, afterAll, beforeEach, expect, jest, test, describe, beforeAll} from '@jest/globals'
import puppeteer from 'puppeteer'
import {connectDb, dropDb } from "../../../util/db_connection.js"
import http from 'http';
import { app } from "../../../../backend/server.js"
import { startServer, endServer } from "../../../util/start_server.js"
import { runDEToolboxRecording } from "../../actions/toolbox_clicks_de"
import { runNLToolboxRecording } from "../../actions/toolbox_clicks_nl.js"
import { runENToolboxRecording } from "../../actions/toolbox_clicks_en.js"
import { runESToolboxRecording } from "../../actions/toolbox_clicks_es.js"
import { runITToolboxRecording } from "../../actions/toolbox_clicks_it.js"
import { runMYToolboxRecording } from "../../actions/toolbox_clicks_my.js"
import { runPLToolboxRecording } from "../../actions/toolbox_clicks_pl.js"
import { runFRToolboxRecording } from "../../actions/toolbox_clicks_fr.js"
import { runELToolboxRecording } from "../../actions/toolbox_clicks_el.js"
import { runARToolboxRecording } from "../../actions/toolbox_clicks_ar.js"

const timeout = 5000;

jest.setTimeout(1000000) // 60s

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
        pageErrors += 1;
        console.log(`ERROR IN REPLAY (${runDEToolboxRecordingWithoutErrors}):\n${error}`)
       });
      await runDEToolboxRecording(browser, page) // run the recording and wait until finished.
      expect(pageErrors).toBe(0); // Assert that there will not be any errors
    });

    let runNLToolboxRecordingWithoutErrors = "All toolbox menus in Dutch open without errors";
    it(runNLToolboxRecordingWithoutErrors, async () => {
      let pageErrors = 0;
      // Register error message event handler to detect console errors
      page.on('pageerror', error => {
        pageErrors += 1;
        console.log(`ERROR IN REPLAY (${runNLToolboxRecordingWithoutErrors}):\n${error}`)
       });
      await runNLToolboxRecording(browser, page) // run the recording and wait until finished.
      expect(pageErrors).toBe(0); // Assert that there will not be any errors
    });

    let runENToolboxRecordingWithoutErrors = "All toolbox menus in English open without errors";
    it(runENToolboxRecordingWithoutErrors, async () => {
      let pageErrors = 0;
      // Register error message event handler to detect console errors
      page.on('pageerror', error => {
        pageErrors += 1;
        console.log(`ERROR IN REPLAY (${runENToolboxRecordingWithoutErrors}):\n${error}`)
       });
      await runENToolboxRecording(browser, page) // run the recording and wait until finished.
      expect(pageErrors).toBe(0); // Assert that there will not be any errors
    });

    let runESToolboxRecordingWithoutErrors = "All toolbox menus in Spanish open without errors";
    it(runESToolboxRecordingWithoutErrors, async () => {
      let pageErrors = 0;
      // Register error message event handler to detect console errors
      page.on('pageerror', error => {
        pageErrors += 1;
        console.log(`ERROR IN REPLAY (${runESToolboxRecordingWithoutErrors}):\n${error}`)
       });
      await runESToolboxRecording(browser, page) // run the recording and wait until finished.
      expect(pageErrors).toBe(0); // Assert that there will not be any errors
    });

    let runITToolboxRecordingWithoutErrors = "All toolbox menus in Italian open without errors";
    it(runITToolboxRecordingWithoutErrors, async () => {
      let pageErrors = 0;
      // Register error message event handler to detect console errors
      page.on('pageerror', error => {
        pageErrors += 1;
        console.log(`ERROR IN REPLAY (${runITToolboxRecordingWithoutErrors}):\n${error}`)
       });
      await runITToolboxRecording(browser, page) // run the recording and wait until finished.
      expect(pageErrors).toBe(0); // Assert that there will not be any errors
    });

    let runMYToolboxRecordingWithoutErrors = "All toolbox menus in Malay open without errors";
    it(runMYToolboxRecordingWithoutErrors, async () => {
      let pageErrors = 0;
      // Register error message event handler to detect console errors
      page.on('pageerror', error => {
        pageErrors += 1;
        console.log(`ERROR IN REPLAY (${runMYToolboxRecordingWithoutErrors}):\n${error}`)
       });
      await runMYToolboxRecording(browser, page) // run the recording and wait until finished.
      expect(pageErrors).toBe(0); // Assert that there will not be any errors
    });

    let runPLToolboxRecordingWithoutErrors = "All toolbox menus in Polish open without errors";
    it(runPLToolboxRecordingWithoutErrors, async () => {
      let pageErrors = 0;
      // Register error message event handler to detect console errors
      page.on('pageerror', error => {
        pageErrors += 1;
        console.log(`ERROR IN REPLAY (${runPLToolboxRecordingWithoutErrors}):\n${error}`)
       });
      await runPLToolboxRecording(browser, page) // run the recording and wait until finished.
      expect(pageErrors).toBe(0); // Assert that there will not be any errors
    });

    let runFRToolboxRecordingWithoutErrors = "All toolbox menus in French open without errors";
    it(runFRToolboxRecordingWithoutErrors, async () => {
      let pageErrors = 0;
      // Register error message event handler to detect console errors
      page.on('pageerror', error => {
        pageErrors += 1;
        console.log(`ERROR IN REPLAY (${runFRToolboxRecordingWithoutErrors}):\n${error}`)
       });
      await runFRToolboxRecording(browser, page) // run the recording and wait until finished.
      expect(pageErrors).toBe(0); // Assert that there will not be any errors
    });

    let runELToolboxRecordingWithoutErrors = "All toolbox menus in Greek open without errors";
    it(runELToolboxRecordingWithoutErrors, async () => {
      let pageErrors = 0;
      // Register error message event handler to detect console errors
      page.on('pageerror', error => {
        pageErrors += 1;
        console.log(`ERROR IN REPLAY (${runELToolboxRecordingWithoutErrors}):\n${error}`)
       });
      await runELToolboxRecording(browser, page) // run the recording and wait until finished.
      expect(pageErrors).toBe(0); // Assert that there will not be any errors
    });

    let runARToolboxRecordingWithoutErrors = "All toolbox menus in Arabic open without errors";
    it(runARToolboxRecordingWithoutErrors, async () => {
      let pageErrors = 0;
      // Register error message event handler to detect console errors
      page.on('pageerror', error => {
        pageErrors += 1;
        console.log(`ERROR IN REPLAY (${runARToolboxRecordingWithoutErrors}):\n${error}`)
       });
      await runARToolboxRecording(browser, page) // run the recording and wait until finished.
      expect(pageErrors).toBe(0); // Assert that there will not be any errors
    });

    afterAll(async () => {
      browser.close()
      await endServer();
    })
  },
  timeout,
);