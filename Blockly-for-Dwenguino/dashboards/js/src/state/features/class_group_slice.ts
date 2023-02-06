import { msg } from "@lit/localize"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { state } from "lit/decorators"
import { setNotification, NotificationInfo } from "./notification_slice"
import { fetchAuth } from "../../middleware/fetch"
import { LoadableState } from "../../util"


interface ClassGroupInfo extends LoadableState{
    name: string,
    sharingCode?: string,
    description: string,
}
interface ClassGroups extends LoadableState {
    groups: ClassGroupInfo[]
}

const initialClassGroupState: ClassGroups = {
    groups: []
}
export const classGroupSlice = createSlice({
    name: "classGroup",
    initialState: initialClassGroupState, 
    /* In these functions you can use mutating logic since the createSlice
    function uses Immer to make sure the logic your write will be immutable.*/
    reducers: {
        addGroup: (state, action) => {
            let classGroup: ClassGroupInfo = {
                name: action.payload.name,
                sharingCode: action.payload.sharingCode,
                description: action.payload.description
            }
            state.groups.push(classGroup)
        },
        setGroups: (state, action) => {
            state.groups = action.payload
        },
        loading: (state) => {
            state.loading = true
        },
        doneLoading: (state) => {
            state.loading = false
        }
    }
})


const addClassGroup = (classGroupInfo) => {
    return async (dispatch, getState) =>{
        dispatch(loading())
        try {
            const response = await fetchAuth("/classgroup/add", {
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(classGroupInfo)
            })
            let json = await response.json()
            console.log(response)
            dispatch(doneLoading())
            dispatch(addGroup(json))
        } catch (err) {
            console.log(err)
        }
    }
}

const getAllClassGroups = () => {
    return async (dispatch, getState) => {
        try {
            const response = await fetchAuth("/classgroup/all", {
                method: "GET",
                headers: { "Content-Type": "application/json"}
            })
            let json = await response.json()
            let groups: ClassGroupInfo[] = json.map((info) => {return {name: info.name, description: info.description, sharingCode: info.sharingCode}})
            console.log(response)
            dispatch(doneLoading())
            dispatch(setGroups(groups))
        } catch (err) {
            console.log(err)
        }
    }
}




const { addGroup, setGroups, loading, doneLoading } = classGroupSlice.actions

const classGroupReducer = classGroupSlice.reducer

export { classGroupReducer, addClassGroup, getAllClassGroups, ClassGroupInfo, ClassGroups }