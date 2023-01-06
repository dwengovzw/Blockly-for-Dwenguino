import puppeteer from 'puppeteer'

let runARToolboxRecording = async (browser, page) => {
    const timeout = 10000;
    page.setDefaultTimeout(timeout);

   {
        const targetPage = page;
        await targetPage.setViewport({"width":1440,"height":787})
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        await targetPage.goto("http://localhost:12032/simulator?lang=ar");
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:a > div.blocklyTreeRow > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 13,
            y: 11.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:a > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 13,
            y: 11.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:b > div.blocklyTreeRow > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 22,
            y: 11.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:b > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 22,
            y: 11.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:c > div.blocklyTreeRow > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 19,
            y: 16.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:c > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 19,
            y: 16.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:d > div.blocklyTreeRow > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 25,
            y: 9.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:d > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 25,
            y: 9.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:e > div.blocklyTreeRow > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 23,
            y: 7.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:e > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 23,
            y: 7.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:f > div.blocklyTreeRow > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 37,
            y: 11.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:f > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 37,
            y: 11.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:g > div.blocklyTreeRow > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 24,
            y: 13.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:g > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 24,
            y: 13.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:i > div.blocklyTreeRow > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 24,
            y: 12.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:i > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 24,
            y: 12.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_socialrobot > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 38.5,
            y: 24,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_socialrobot > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 1,
            y: 1,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:j > div:nth-child(2)"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 61,
            y: 174,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:q > div.blocklyTreeRow > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 41,
            y: 6.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:q > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 41,
            y: 6.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:s > div.blocklyTreeRow > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 28,
            y: 11.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:s > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 28,
            y: 11.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:t > div.blocklyTreeRow > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 24,
            y: 8.234375,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#blockly\\:t > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 24,
            y: 8.234375,
          },
        });
    }

    async function waitForSelectors(selectors, frame, options) {
      for (const selector of selectors) {
        try {
          return await waitForSelector(selector, frame, options);
        } catch (err) {
          console.error(err);
        }
      }
      throw new Error('Could not find element for selectors: ' + JSON.stringify(selectors));
    }

    async function scrollIntoViewIfNeeded(element, timeout) {
      await waitForConnected(element, timeout);
      const isInViewport = await element.isIntersectingViewport({threshold: 0});
      if (isInViewport) {
        return;
      }
      await element.evaluate(element => {
        element.scrollIntoView({
          block: 'center',
          inline: 'center',
          behavior: 'auto',
        });
      });
      await waitForInViewport(element, timeout);
    }

    async function waitForConnected(element, timeout) {
      await waitForFunction(async () => {
        return await element.getProperty('isConnected');
      }, timeout);
    }

    async function waitForInViewport(element, timeout) {
      await waitForFunction(async () => {
        return await element.isIntersectingViewport({threshold: 0});
      }, timeout);
    }

    async function waitForSelector(selector, frame, options) {
      if (!Array.isArray(selector)) {
        selector = [selector];
      }
      if (!selector.length) {
        throw new Error('Empty selector provided to waitForSelector');
      }
      let element = null;
      for (let i = 0; i < selector.length; i++) {
        const part = selector[i];
        if (element) {
          element = await element.waitForSelector(part, options);
        } else {
          element = await frame.waitForSelector(part, options);
        }
        if (!element) {
          throw new Error('Could not find element: ' + selector.join('>>'));
        }
        if (i < selector.length - 1) {
          element = (await element.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
        }
      }
      if (!element) {
        throw new Error('Could not find element: ' + selector.join('|'));
      }
      return element;
    }

    async function waitForElement(step, frame, timeout) {
      const count = step.count || 1;
      const operator = step.operator || '>=';
      const comp = {
        '==': (a, b) => a === b,
        '>=': (a, b) => a >= b,
        '<=': (a, b) => a <= b,
      };
      const compFn = comp[operator];
      await waitForFunction(async () => {
        const elements = await querySelectorsAll(step.selectors, frame);
        return compFn(elements.length, count);
      }, timeout);
    }

    async function querySelectorsAll(selectors, frame) {
      for (const selector of selectors) {
        const result = await querySelectorAll(selector, frame);
        if (result.length) {
          return result;
        }
      }
      return [];
    }

    async function querySelectorAll(selector, frame) {
      if (!Array.isArray(selector)) {
        selector = [selector];
      }
      if (!selector.length) {
        throw new Error('Empty selector provided to querySelectorAll');
      }
      let elements = [];
      for (let i = 0; i < selector.length; i++) {
        const part = selector[i];
        if (i === 0) {
          elements = await frame.$$(part);
        } else {
          const tmpElements = elements;
          elements = [];
          for (const el of tmpElements) {
            elements.push(...(await el.$$(part)));
          }
        }
        if (elements.length === 0) {
          return [];
        }
        if (i < selector.length - 1) {
          const tmpElements = [];
          for (const el of elements) {
            const newEl = (await el.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
            if (newEl) {
              tmpElements.push(newEl);
            }
          }
          elements = tmpElements;
        }
      }
      return elements;
    }

    async function waitForFunction(fn, timeout) {
      let isActive = true;
      setTimeout(() => {
        isActive = false;
      }, timeout);
      while (isActive) {
        const result = await fn();
        if (result) {
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      throw new Error('Timed out');
    }
}

export { runARToolboxRecording }