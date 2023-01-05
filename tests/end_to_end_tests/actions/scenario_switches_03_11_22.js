import puppeteer from 'puppeteer'

let runSwitchScenarioRecording = async () => {
    const timeout = 10000;
    page.setDefaultTimeout(timeout);

    {
        const targetPage = page;
        await targetPage.setViewport({"width":1387,"height":800})
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        await targetPage.goto("http://localhost:12032/simulator");
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_moving > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 14.359375,
            y: 22,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_wall > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 23.640625,
            y: 27,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_socialrobot > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 10.9375,
            y: 27,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_conveyor > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 11.890625,
            y: 27,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_socialrobot > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 27.9375,
            y: 28,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_wall > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 15.640625,
            y: 21,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_moving > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 27.359375,
            y: 26,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_spyrograph > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 21.078125,
            y: 32,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_wall > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 32.640625,
            y: 25,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_conveyor > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 22.890625,
            y: 25,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_moving > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 21.359375,
            y: 30,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_wall > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 16.640625,
            y: 25,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_socialrobot > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 10.9375,
            y: 28,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_spyrograph > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 18.078125,
            y: 44,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_conveyor > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 20.890625,
            y: 20,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#scenario_label_moving > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 16.359375,
            y: 33,
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

export { runSwitchScenarioRecording }