import {afterEach, afterAll, beforeEach, expect, jest, test, describe, beforeAll} from '@jest/globals'
import puppeteer from 'puppeteer'
import {connectDb, dropDb } from "../../util/db_connection.js"
import http from 'http';
import { app } from "../../../backend/server.js"
import { startServer, endServer } from "../../util/start_server.js"

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

describe(
  '/ (Home Page)',
  () => {
    let page;
    beforeAll(async () => {
        startServer();
        page = await globalThis.__BROWSER_GLOBAL__.newPage();
        await page.goto('http://localhost:12032/simulator');
    }, timeout);

    it('should load without error', async () => {
      const text = await page.evaluate(() => document.body.textContent);
      expect(text).toContain('Dwenguino simulator');
    });

    afterAll(async () => {
        endServer();
    })
  },
  timeout,
);