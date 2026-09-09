/**
 * @jest-environment jsdom
 */

import { expect, jest } from "@jest/globals";
import DwenguinoBoardSimulation from "../../../../../../../Blockly-for-Dwenguino/DwenguinoIDE/js/src/scenario/dwenguino_board_simulation.js";

beforeAll(() => {
    global.DwenguinoBlocklyLanguageSettings = {
        translateFrom: () => "distance",
    };
});

test("Wall sonar value is rounded to no decimals", () => {
    document.body.innerHTML = '<div id="sim_container"></div>';

    const board = {
        getSonarDistance: jest.fn(() => 41.8),
        getButtonState: jest.fn(() => 1),
        getTonePlaying: jest.fn(() => 0),
        getBackLightStatus: jest.fn(() => 1),
        getLcdContent: jest.fn(() => ""),
        getLedState: jest.fn(() => 0),
    };

    const simulation = new DwenguinoBoardSimulation(null);
    simulation.setUseSonarSlider(false);
    simulation.initSimulationDisplay('sim_container');
    simulation.updateScenarioDisplay(board);

    const input = document.getElementById('sonar_input');
    expect(input).not.toBeNull();
    expect(input.value).toBe('42');
});
