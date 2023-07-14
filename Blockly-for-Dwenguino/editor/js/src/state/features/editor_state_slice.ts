import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IBaseSavedState, ISavedTextualProgram } from "../../../../../../backend/models/saved_state.model";
import { msg } from "@lit/localize";
import { downloadBlobToFile, requestCodeCompilation } from "../../util/compilation"
import FileIOController from "../../../../../DwenguinoIDE/js/src/utils/file_io_controller";
import {setNotificationMessage, NotificationMessageType} from "../../../../../dashboards/js/src/state/features/notification_slice"

interface IFrontendEditorState extends IBaseSavedState {
    simulatorOpened: boolean;
    compiling: boolean;
}

const emptyJavascriptProgram = `
    #include <Wire.h>
    #include <Dwenguino.h>
    #include <LiquidCrystal.h>
    void setup()
    {
    initDwenguino();
    }
    void loop()
    {
    }
`;

const EDITOR_VIEWS = {
    BLOCKS: "blocks",
    TEXT: "text",
}

const emptyCppCodeList: ISavedTextualProgram[] = [];
const initialEditorState = {
    blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml"><block type="setup_loop_structure" id="{qm%,~{T;Qd1nDUTjZWn" x="100" y="100"/></xml>`,
    blocklyJavascript: emptyJavascriptProgram,
    cppCode: emptyCppCodeList,
    socialRobotXml: "",
    name: "",
    view: EDITOR_VIEWS.BLOCKS,
    scenario: "spyrograph",
    simulatorOpened: true,
    compiling: false,
    lastCompilationError: "",
    openCodeTab: 0,
};

export const editorStateSlice = createSlice({
    name: "editorState",
    initialState: initialEditorState,
    reducers: {
        setEditorState: (state, action) => {
            state.blocklyXml = action.payload.blocklyXml;
            state.cppCode = action.payload.cppCode;
            state.socialRobotXml = action.payload.socialRobotXml;
            state.name = action.payload.name;
            state.view = action.payload.view;
            state.scenario = action.payload.scenario;
        },
        setBlocklyXml: (state, action) => {
            state.blocklyXml = action.payload;
        },
        setCppCode: (state, action) => {
            state.cppCode = action.payload;
        },
        setSocialRobotXml: (state, action) => {
            state.socialRobotXml = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        setView: (state, action) => {
            state.view = action.payload;
        },
        setScenario: (state, action) => {
            state.scenario = action.payload;
        },
        setSimulatorOpened: (state, action) => {
            state.simulatorOpened = action.payload;
        },
        setCompiling: (state, action) => {
            state.compiling = action.payload;
        },
        setLastCompilationError: (state, action) => {
            state.lastCompilationError = action.payload;
        },
        setOpenCodeTab: (state, action) => {
            state.openCodeTab = action.payload;
        }
    },
});


// Middleware for async thunk actions (compile, download, upload, ...)
const compileCode = (code: string) => {
    return async (dispatch: any, getState: any) => {
        dispatch(setCompiling(true));
        try {
            const { blob, filename } = await requestCodeCompilation(
                code,
                getState().editorState.name
            );
            downloadBlobToFile(blob, filename);
            dispatch(setLastCompilationError(msg("Compilation successful.\nDownloading file...")));
            dispatch(setNotificationMessage(msg("Compilation successful.\nDownloading file..."), NotificationMessageType.MESSAGE));
        } catch (err: any) {
            dispatch(setLastCompilationError(err.toString()));
            dispatch(setNotificationMessage(err.toString(), NotificationMessageType.ERROR));
        } finally {
            dispatch(setCompiling(false));
        }
    };
};

const compileCurrentCode = () => {
    return async (dispatch: any, getState: any) => {
        if (getState().editorState.view === EDITOR_VIEWS.BLOCKS) {
            dispatch(compileCode(getState().editorState.blocklyJavascript));
        } else {
            dispatch(compileCode(getState().editorState.cppCode[getState().editorState.openCodeTab].cppCode));
        }
    };
};

const compileEmtpyCode = () => {
    return async (dispatch: any, getState: any) => {
        dispatch(compileCode(emptyJavascriptProgram));
    };
};

const downloadCppCode = (tabId = 0) => {
    return async (dispatch: any, getState: any) => {
        try {
            FileIOController.download(getState().editorState.name + ".cpp", getState().editorState.cppCode[tabId].cppCode);
        } catch (err: any) {
            dispatch(setNotificationMessage(err.toString(), NotificationMessageType.ERROR));
        }
    };
};

const downloadBlocklyXmlCode = () => {
    return async (dispatch: any, getState: any) => {
        try {
            const filename = getState().editorState.name ? getState().editorState.name + ".xml" : "blocks.xml";
            FileIOController.download(filename, getState().editorState.blocklyXml);
        } catch (err: any) {
            dispatch(setNotificationMessage(err.toString(), NotificationMessageType.ERROR));
        }
    };
};

const downloadCode = () => {
    return async (dispatch: any, getState: any) => {
        if (getState().editorState.view === EDITOR_VIEWS.BLOCKS) {
            dispatch(downloadBlocklyXmlCode());
        } else {
            dispatch(downloadCppCode(getState().editorState.openCodeTab));
        }
    };
};


const {
    setEditorState,
    setBlocklyXml,
    setCppCode,
    setSocialRobotXml,
    setName,
    setView,
    setScenario,
    setSimulatorOpened,
    setCompiling,
    setLastCompilationError,
    setOpenCodeTab
} = editorStateSlice.actions;

const editorStateReducer = editorStateSlice.reducer;

export {
    editorStateReducer,
    setEditorState,
    setBlocklyXml,
    setCppCode,
    setSocialRobotXml,
    setName,
    setView,
    setScenario,
    setSimulatorOpened,
    setCompiling,
    setLastCompilationError,
    setOpenCodeTab,
    compileCode,
    downloadCppCode,
    downloadBlocklyXmlCode,
    compileCurrentCode,
    compileEmtpyCode,
    downloadCode,
    EDITOR_VIEWS
};
