
import url from 'url';
import { createRunner } from '@puppeteer/replay';

export const flow = {
    "title": "toolbox_clicks_de",
    "steps": [
        {
            "type": "setViewport",
            "width": 1920,
            "height": 967,
            "deviceScaleFactor": 1,
            "isMobile": false,
            "hasTouch": false,
            "isLandscape": false
        },
        {
            "type": "navigate",
            "url": "https://blockly.dwengo.org/?lang=de",
            "assertedEvents": [
                {
                    "type": "navigation",
                    "url": "https://blockly.dwengo.org/?lang=de",
                    "title": "Blockly Demo: DwenguinoBlockly DwenguinoBlockly"
                }
            ]
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "#blockly\\:a > div.blocklyTreeRow > span.blocklyTreeLabel"
                ]
            ],
            "offsetY": 15.234375,
            "offsetX": 42
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "#blockly\\:a > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"
                ]
            ],
            "offsetY": 15.234375,
            "offsetX": 42
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "#blockly\\:b > div.blocklyTreeRow > span.blocklyTreeLabel"
                ]
            ],
            "offsetY": 16.234375,
            "offsetX": 44
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "#blockly\\:b > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"
                ]
            ],
            "offsetY": 16.234375,
            "offsetX": 44
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "#blockly\\:c > div.blocklyTreeRow > span.blocklyTreeLabel"
                ]
            ],
            "offsetY": 15.234375,
            "offsetX": 48
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "#blockly\\:c > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"
                ]
            ],
            "offsetY": 15.234375,
            "offsetX": 48
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "#blockly\\:d > div.blocklyTreeRow > span.blocklyTreeLabel"
                ]
            ],
            "offsetY": 10.234375,
            "offsetX": 41
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "#blockly\\:d > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"
                ]
            ],
            "offsetY": 10.234375,
            "offsetX": 41
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "#blockly\\:e > div.blocklyTreeRow > span.blocklyTreeLabel"
                ]
            ],
            "offsetY": 9.234375,
            "offsetX": 29
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "#blockly\\:e > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"
                ]
            ],
            "offsetY": 9.234375,
            "offsetX": 29
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "#blockly\\:f > div.blocklyTreeRow > span.blocklyTreeLabel"
                ]
            ],
            "offsetY": 11.234375,
            "offsetX": 40
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "#blockly\\:f > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"
                ]
            ],
            "offsetY": 11.234375,
            "offsetX": 40
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "#blockly\\:g > div.blocklyTreeRow > span.blocklyTreeLabel"
                ]
            ],
            "offsetY": 13.234375,
            "offsetX": 41
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "#blockly\\:g > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"
                ]
            ],
            "offsetY": 13.234375,
            "offsetX": 41
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "#blockly\\:i > div.blocklyTreeRow > span.blocklyTreeLabel"
                ]
            ],
            "offsetY": 11.234375,
            "offsetX": 44
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "#blockly\\:i > div.blocklyTreeRow.blocklyTreeSelected > span.blocklyTreeLabel"
                ]
            ],
            "offsetY": 11.234375,
            "offsetX": 44
        }
    ]
};

export async function run() {
  const runner = await createRunner(flow);
  await runner.run();
}

if (process && import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  await run();
}