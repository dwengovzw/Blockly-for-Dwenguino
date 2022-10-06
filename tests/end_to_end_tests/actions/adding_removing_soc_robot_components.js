import puppeteer from 'puppeteer'

let runAddRemoveComponentsRecording = async (browser, page) => {
  const timeout = 1000000;
  page.setDefaultTimeout(timeout);

   {
        const targetPage = page;
        await targetPage.setViewport({"width":1440,"height":787})
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
        const element = await waitForSelectors([["#scenario_label_socialrobot > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 19.5,
            y: 15,
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
        const element = await waitForSelectors([["#rc_sonar_plus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 2.90625,
            y: 8.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_sound_plus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 11.25,
            y: 11.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_servo_plus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 6.75,
            y: 11.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_continuousservo_plus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 13.25,
            y: 24.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_lcd_plus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 4.75,
            y: 6.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_ledmatrixsegment_plus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 18.25,
            y: 14.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_rgbled_plus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 20.75,
            y: 16.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_pir_plus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 1.546875,
            y: 18.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_touch_plus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 10.40625,
            y: 9.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_led_plus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 19.90625,
            y: 19.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_button_plus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 8.40625,
            y: 6.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_light_plus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 7.046875,
            y: 8.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_sonar_minus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 10,
            y: 8.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_sound_minus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 10.65625,
            y: 7.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_servo_minus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 5,
            y: 5.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_continuousservo_minus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 20.5,
            y: 20.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_lcd_minus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 6,
            y: 9.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_ledmatrixsegment_minus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 4.5,
            y: 11.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_rgbled_minus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 5,
            y: 4.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_pir_minus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 7.5,
            y: 7.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_touch_minus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 3.296875,
            y: 20.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_led_minus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 7.15625,
            y: 27.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 1.65625,
            y: 119.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_button_minus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 5.65625,
            y: 6.015625,
          },
        });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#rc_light_minus_button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({
          offset: {
            x: 0.15625,
            y: 6.015625,
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


export { runAddRemoveComponentsRecording }