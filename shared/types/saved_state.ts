export interface SavedStateInfo {
    uuid: string,
    blocklyXml: string,
    cppCode: string[],
    socialRobotXml: string,
    savedAt: string,
    name: string,
    view: string,
    scenario: string
}

export const initialGroups: SavedStateInfo[] = []
export const initialState = 
    {
        states: initialGroups,
        loading: false
    }