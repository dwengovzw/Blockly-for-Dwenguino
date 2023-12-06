import {afterAll, expect, jest, describe, beforeAll} from '@jest/globals'

import puppeteer from 'puppeteer'
import { startServer, endServer } from "../../../../util/start_server.js"
import { runToolboxRecording } from "../../actions/toolbox_clicks.js"
import { beforeEach } from 'node:test';

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
        browser = await puppeteer.launch({ headless: "new", dumpio: false, args: ['--no-sandbox', '--disable-setuid-sandbox']});
        page = await browser.newPage();    
        page.on("dialog", (d) => { d.accept(); }); // Accept all dialogs the page displays    
    }, timeout);

    beforeEach(async () => {
      //jest.useFakeTimers();
    });


    let runTestForLanguage = async (language) => {
      let runToolboxRecordingWithoutErrors = "All toolbox menus in " + language + " open without errors";
      let pageErrors = 0;
      // Register error message event handler to detect console errors
      page.on('pageerror', error => {
        pageErrors += 1;
        console.log(`ERROR IN REPLAY (${runToolboxRecordingWithoutErrors}):\n${error}`)
       });
      await runToolboxRecording(language, browser, page) // run the recording and wait until finished.
      expect(pageErrors).toBe(0); // Assert that there will not be any errors
    }

    let runFRToolboxRecordingWithoutErrors = "All toolbox menus in French open without errors";
    it(runFRToolboxRecordingWithoutErrors, async () => {
      await runTestForLanguage("fr")
    })


    let runENToolboxRecordingWithoutErrors = "All toolbox menus in English open without errors";
    it(runENToolboxRecordingWithoutErrors, async () => {
      await runTestForLanguage("en")
    });

    let runDEToolboxRecordingWithoutErrors = "All toolbox menus in German open without errors";
    it(runDEToolboxRecordingWithoutErrors, async () => {
      await runTestForLanguage("de")
    });

    let runNLToolboxRecordingWithoutErrors = "All toolbox menus in Dutch open without errors";
    it(runNLToolboxRecordingWithoutErrors, async () => {
      await runTestForLanguage("nl")
    });

    let runESToolboxRecordingWithoutErrors = "All toolbox menus in Spanish open without errors";
    it(runESToolboxRecordingWithoutErrors, async () => {
      await runTestForLanguage("es")
    });

    let runITToolboxRecordingWithoutErrors = "All toolbox menus in Italian open without errors";
    it(runITToolboxRecordingWithoutErrors, async () => {
      await runTestForLanguage("it")
    });

    let runMYToolboxRecordingWithoutErrors = "All toolbox menus in Malay open without errors";
    it(runMYToolboxRecordingWithoutErrors, async () => {
      await runTestForLanguage("my")
    });

    let runPLToolboxRecordingWithoutErrors = "All toolbox menus in Polish open without errors";
    it(runPLToolboxRecordingWithoutErrors, async () => {
      await runTestForLanguage("pl")
    });
    
    let runELToolboxRecordingWithoutErrors = "All toolbox menus in Greek open without errors";
    it(runELToolboxRecordingWithoutErrors, async () => {
      await runTestForLanguage("el")
    });

    let runARToolboxRecordingWithoutErrors = "All toolbox menus in Arabic open without errors";
    it(runARToolboxRecordingWithoutErrors, async () => {
      await runTestForLanguage("ar")
    });

    afterAll(async () => {
      if (browser){
        await browser.close();
      }
      await endServer();
    })
  },
  timeout,
);