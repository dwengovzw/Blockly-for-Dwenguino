import { expect } from "@jest/globals";
import {jest} from '@jest/globals'
import BoardState from "../../../../../../../Blockly-for-Dwenguino/DwenguinoIDE/js/src/simulation/board_state";


test("Test get tone playing on pin", () => {
    let state = new BoardState();
    expect(state.getTonePlayingOnPin(1)).toBe(0);
});