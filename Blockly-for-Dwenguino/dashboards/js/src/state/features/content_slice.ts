import { msg } from "@lit/localize"
import { createSlice } from "@reduxjs/toolkit"
import { store } from "../../state/store"
import { setNotificationMessage, NotificationMessageType } from "./notification_slice"
import { createRequestMiddleware } from "../../middleware/fetch"

interface BaseLearningPath{
    hruid: string,
    language: string,
    title: string,
    description?: string,
    image?: string,
    min_age?: number,
    max_age?: number,
}

interface LearningPath extends BaseLearningPath{
    nodes: LearningPathNode[],
}

interface LearningObjectId {
    hruid: string,
    language: string,
    version: string,
}

const areLearningObjectsEqual = (object1: LearningObjectId, object2: LearningObjectId) => {
    return object1.hruid === object2.hruid && object1.language === object2.language && object1.version === object2.version
}

interface LearningPathNode extends LearningObjectId{
    transitions: LearningPathTransition[],
    htmlContent?: string,
}

interface LearningPathTransition {
    next: LearningObjectId,
    default?: boolean,
    condition?: string,
}

const areLearningPathNodesEqual = (node1: LearningPathNode, node2: LearningPathNode) => {
    return node1.hruid === node2.hruid && node1.language === node2.language && node1.version === node2.version
}


export const contentSlice = createSlice({
    name: "content",
    initialState: {
        learningPaths: [] as LearningPath[],
    },
    reducers: {
        setLearningPaths: (state, action) => {
            state.learningPaths = action.payload
        },
    }
})

const fetchLearningPaths = (filter: string, lang: string, min_age: number, max_age: number) => {
    return createRequestMiddleware(`${globalSettings.learningObjectAPIBasePath}` + "/api/learningPath/search?all=" + filter + "&language=" + lang + "&min_age=" + min_age + "&max_age=" + max_age, 
                                    "GET",
                                    (dispatch, getState, json) => {
                                        let learningPaths: LearningPath[] = json.map(
                                            (learningPath: any) => {
                                                return {
                                                    hruid: learningPath.hruid,
                                                    language: learningPath.language,
                                                    title: learningPath.title,
                                                    description: learningPath.description,
                                                    image: learningPath.image,
                                                    min_age: learningPath.min_age,
                                                    max_age: learningPath.max_age,
                                                    nodes: learningPath.nodes.map((node) => {
                                                        return {
                                                            hruid: node.learningobject_hruid,
                                                            language: node.language,
                                                            version: node.version,
                                                            transitions: node.transitions.map((transition) => {
                                                                return {
                                                                    next: {
                                                                        hruid: transition.next.hruid,
                                                                        language: transition.next.language,
                                                                        version: transition.next.version,
                                                                    },
                                                                    default: transition.default,
                                                                    condition: transition.condition,
                                                                }
                                                            }),
                                                        }
                                                    }),
                                                }
                                            }
                                        )
                                        dispatch(setLearningPaths(learningPaths))
                                    }, {}, msg("Error fetching learning paths")
    )
}

const { setLearningPaths } = contentSlice.actions
const contentReducer = contentSlice.reducer

export { areLearningPathNodesEqual, areLearningObjectsEqual, contentReducer, BaseLearningPath, LearningPath, LearningPathNode, LearningPathTransition, LearningObjectId, fetchLearningPaths }