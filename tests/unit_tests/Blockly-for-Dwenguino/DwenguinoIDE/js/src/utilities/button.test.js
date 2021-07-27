/**
 * @jest-environment jsdom
 */

 import { expect } from "@jest/globals";
 import {jest} from '@jest/globals'
 import Button from "../../../../../../../Blockly-for-Dwenguino/DwenguinoIDE/js/src/scenario/utilities/button";
 
 
test("Constructor", () => {
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let button = new Button('1', 'parent', 'Button 1');
    expect(button._id).toBe('1');
    expect(button._parentId).toBe('parent');
    expect(button._buttonId).toBe('button_1_button');
    expect(button._label).toBe('Button 1');
    expect(button._buttonLabelId).toBe('button_1_label');
    expect(button._labelClasses).toBe('');
    expect(button._activeClasses).toBe("dwenguino_button dwenguino_button_pushed");
    expect(button._inactiveClasses).toBe("dwenguino_button");

    document.getElementById('button_1_button').remove();
    document.getElementById('button_1_label').remove();
});