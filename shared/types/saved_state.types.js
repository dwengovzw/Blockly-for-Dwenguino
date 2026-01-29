// shared/models/saved_state.types.ts
/* ---------- enums / constants ---------- */
export const SAVEDPROGRAM_TYPES = {
    blockly: "blockly",
    cpp: "cpp"
};
export const ENVIRONMENT_VIEW = {
    blocks: "blocks",
    text: "text"
};
export const SCENARIO = {
    spyrograph: "spyrograph",
    moving: "moving",
    wall: "wall",
    socialrobot: "socialrobot",
    conveyor: "conveyor"
};
/* ---------- shared defaults ---------- */
export const emptyProgramXml = `<xml xmlns="https://developers.google.com/blockly/xml">
       <block type="setup_loop_structure" id="VhdRW_[ESo[A-z)oA.Ik" x="10" y="10"/>
     </xml>`;
export const emptySocialRobotDesign = `<xml xmlns="http://www.w3.org/1999/xhtml">
       <Item Type='background' Class='background1' Id='1'></Item>
     </xml>`;
//# sourceMappingURL=saved_state.types.js.map