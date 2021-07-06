/**
 * @jest-environment jsdom
 */

import { expect } from "@jest/globals";
import {jest} from '@jest/globals'
import Slider from "../../../../../../Blockly-for-Dwenguino/DwenguinoIDE/js/src/scenario/utilities/slider";


test("Constructor", () => {
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 200, 0, 'Slider 1');
    expect(slider._id).toBe('1');
    expect(slider._parentId).toBe('parent');
    expect(slider._sliderId).toBe('slider_1');
    expect(slider._minValue).toBe(0);
    expect(slider._maxValue).toBe(200);
    expect(slider._initialValue).toBe(0);
    expect(slider._label).toBe('Slider 1');
    expect(slider._valuePrefix).toBe('');
    expect(slider._valueSuffix).toBe('');
    expect(slider._sliderLabelId).toBe('slider_1_label');
    expect(slider._sliderValueId).toBe('slider_1_value');
    expect(slider._sliderRangeId).toBe('slider_1_range');
    expect(slider._classes).toBe('');

    document.getElementById('slider_1').remove();
    document.getElementById('slider_1_label').remove();
    document.getElementById('slider_1_value').remove();
});

test("UpdateValueLabel without prefix and suffix", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 200, 0, 'Slider 1');
    expect(document.getElementById(slider.getSliderValueId()).innerHTML).toBe('0');
    slider.updateValueLabel(75);
    expect(document.getElementById(slider.getSliderValueId()).innerHTML).toBe('75');

    slider.remove(); 
});

test("UpdateValueLabel with prefix and suffix", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 200, 0, 'Slider 1', 'prefix ', ' cm');
    expect(document.getElementById(slider.getSliderValueId()).innerHTML).toBe('prefix 0 cm');
    slider.updateValueLabel(75);
    expect(document.getElementById(slider.getSliderValueId()).innerHTML).toBe('prefix 75 cm');

    slider.remove(); 
});

test("Remove slider", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 200, 0, 'Slider 1');
    expect(document.getElementById(slider.getSliderId())).toBeDefined();
    slider.remove();
    expect(document.getElementById('slider_1')).toBeNull();
});

test("getParentId", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 200, 0, 'Slider 1');
    expect(slider.getParentId()).toBe('parent');
    slider.remove();    
});

test("getSliderElement", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 200, 0, 'Slider 1');
    expect(slider.getSliderElement()).toBeDefined();
    expect(slider.getSliderElement().id).toBe('slider_1_range');
    slider.remove();   
});

test("getInitialValue 0", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 200, 0, 'Slider 1');
    expect(slider.getInitialValue()).toBe(0);
    slider.remove();   
});

test("getInitialValue 1", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 200, 1, 'Slider 1');
    expect(slider.getInitialValue()).toBe(1);
    slider.remove();   
});

test("getMinValue 0", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 200, 0, 'Slider 1');
    expect(slider.getMinValue()).toBe(0);
    slider.remove(); 
});

test("getMinValue 100", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 100, 200, 0, 'Slider 1');
    expect(slider.getMinValue()).toBe(100);
    slider.remove(); 
});

test("getMaxValue 200", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 200, 0, 'Slider 1');
    expect(slider.getMaxValue()).toBe(200);
    slider.remove(); 
});

test("getMaxValue 100", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 100, 0, 'Slider 1');
    expect(slider.getMaxValue()).toBe(100);
    slider.remove(); 
});

test("getLabel", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 100, 0, 'Slider 1');
    expect(slider.getLabel()).toBe('Slider 1');
    slider.remove(); 
});

test("getValuePrefix", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 100, 0, 'Slider 1');
    expect(slider.getValuePrefix()).toBe('');
    slider.remove(); 
});

test("getValuePrefix", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 100, 0, 'Slider 1', '€ ');
    expect(slider.getValuePrefix()).toBe('€ ');
    slider.remove(); 
});

test("getValueSuffix", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 100, 0, 'Slider 1', '', '');
    expect(slider.getValueSuffix()).toBe('');
    slider.remove(); 
});

test("getValueSuffix", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 100, 0, 'Slider 1', '', ' cm');
    expect(slider.getValueSuffix()).toBe(' cm');
    slider.remove(); 
});

test("getSliderId", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 100, 0, 'Slider 1', '€ ');
    expect(slider.getSliderId()).toBe('slider_1');
    slider.remove(); 
});

test("getSliderLabelId", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 100, 0, 'Slider 1', '€ ');
    expect(slider.getSliderLabelId()).toBe('slider_1_label');
    slider.remove(); 
});

test("getSliderValueId", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 100, 0, 'Slider 1', '€ ');
    expect(slider.getSliderValueId()).toBe('slider_1_value');
    slider.remove(); 
});

test("getSliderRangeId", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 100, 0, 'Slider 1', '€ ');
    expect(slider.getSliderRangeId()).toBe('slider_1_range');
    slider.remove(); 
});

test("getClasses", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 100, 0, 'Slider 1', '€ ');
    expect(slider.getClasses()).toBe('');
    slider.remove(); 
});

test("getClasses", () =>{
    document.body.innerHTML =
    '<div id="parent">' +
    '</div>';

    let slider = new Slider('1', 'parent', 0, 100, 0, 'Slider 1', '€ ', '', 'example_class');
    expect(slider.getClasses()).toBe('example_class');
    slider.remove(); 
});