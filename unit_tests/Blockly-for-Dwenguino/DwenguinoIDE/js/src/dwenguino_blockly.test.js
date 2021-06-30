import {expect, jest, test} from '@jest/globals'
import { DwenguinoBlockly } from '../../../../../Blockly-for-Dwenguino/DwenguinoIDE/js/src/dwenguino_blockly.js'

test("Testing test", ()=>{
    expect(DwenguinoBlockly.functionToTest(5)).toBe(5);
});