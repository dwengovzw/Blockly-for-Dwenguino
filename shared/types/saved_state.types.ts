// shared/models/saved_state.types.ts

/* ---------- enums / constants ---------- */

export const SAVEDPROGRAM_TYPES = {
    blockly: "blockly",
    cpp: "cpp"
  } as const;
  
  export const ENVIRONMENT_VIEW = {
    blocks: "blocks",
    text: "text"
  } as const;
  
  export const SCENARIO = {
    spyrograph: "spyrograph",
    moving: "moving",
    wall: "wall",
    socialrobot: "socialrobot",
    conveyor: "conveyor",
    gripper: "gripper"
  } as const;
  
  /* ---------- pure data types ---------- */
  
  export interface ISavedTextualProgram {
    filename: string;
    cppCode: string;
  }
  
  export interface ISavedState {
    uuid?: string;
    blocklyXml: string;
    cppCode: ISavedTextualProgram[];
    socialRobotXml: string;
    savedAt: Date;
    name: string;
  
    /**
     * Frontend-safe representation:
     * backend will use ObjectId,
     * frontend will typically receive a string
     */
    user: string;
  
    inPortfolio: boolean;
    inSavedItemList: boolean;
    view: string;
    scenario: string;
  }
  
  /* ---------- shared defaults ---------- */
  
  export const emptyProgramXml =
    `<xml xmlns="https://developers.google.com/blockly/xml">
       <block type="setup_loop_structure" id="VhdRW_[ESo[A-z)oA.Ik" x="10" y="10"/>
     </xml>`;
  
  export const emptySocialRobotDesign =
    `<xml xmlns="http://www.w3.org/1999/xhtml">
       <Item Type='background' Class='background1' Id='1'></Item>
     </xml>`;
  