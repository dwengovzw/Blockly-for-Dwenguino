import { msg } from "@lit/localize"
import { createSlice } from "@reduxjs/toolkit"
import { createRequestMiddleware } from "../../middleware/fetch"
import { LearningObjectId, LearningPath, LearningPathNode, BaseLearningPath, areLearningObjectsEqual } from "./content_slice"
import { store } from "../store"
import { set } from "mongoose"
import { get } from "jquery"
import { NotificationMessageType, doneLoading, loading, setNotificationMessage } from "./notification_slice"


interface DetailedLearningPathNode extends LearningPathNode{
    start_node?: boolean,
    aspect_ratio?: number,
    available?: boolean,
    content_type?: string,
    copyright?: string,
    created_at?: string,
    description?: string,
    difficulty?: number,
    educational_goals: string[],
    estimated_time?: number,
    keywords?: string[],
    license?: string,
    return_value?: string,
    skos_concepts?: string[],
    target_ages?: number[],
    title?: string,
    updatedAt?: string,

}

interface DetailedLearningPath extends BaseLearningPath{
    nodes: DetailedLearningPathNode[],
}

interface LearningPathProgress {
    current_step: LearningPathNode,
    learning_object_solutions: Record<string, string> // key is a stringified LearningObjectId, value is solution in json format
}

interface ActiveLearningPath {
    path: DetailedLearningPath,
    progress: LearningPathProgress,
}

const emptyActiveLearningPath: ActiveLearningPath = {
    path: {
        hruid: "",
        language: "",
        title: "",
        nodes: [],
    } as DetailedLearningPath,
    progress: {
        current_step: {
            hruid: "",
            language: "",
            version: "",
            transitions: [],
        },
        learning_object_solutions: {},
    },
}

export const activeLearningPathSlice = createSlice({
    name: "learningPathProgress",
    initialState: {
        activeLearningPath: {...emptyActiveLearningPath},
    },
    reducers: {
        setActiveLearningPath: (state, action) => {
            state.activeLearningPath.path = action.payload;
        },
        setLearningObjectSolution: (state, action) => {
            if (state.activeLearningPath) {
                state.activeLearningPath.progress.learning_object_solutions[
                    JSON.stringify(action.payload.learningObjectId)
                ] = action.payload.solution;
            }
        },
        removeLearningObjectSolution: (state, action) => {
            if (state.activeLearningPath) {
                delete state.activeLearningPath.progress.learning_object_solutions[
                    JSON.stringify(action.payload)
                ];
            }
        },
        setCurrentStep: (state, action) => {
            if (state.activeLearningPath) {
                state.activeLearningPath.progress.current_step = action.payload;
            }
        },
        setCurrentStepContent: (state, action) => {
            if (state.activeLearningPath) {
                state.activeLearningPath.progress.current_step.htmlContent = action.payload;
            }
        }
    },
});

const fetchLearningPathDetails = (learningPath: LearningPath) => {
    return createRequestMiddleware(
        `${globalSettings.learningObjectAPIBasePath}/api/learningPath/${learningPath.hruid}/${learningPath.language}`,
        "GET", 
        (dispatch, getState, json) => {
            let lp: DetailedLearningPath = {
                hruid: json.hruid,
                language: json.language,
                title: json.title,
                description: json.description,
                image: json.image,
                nodes: json.nodes.map((node: any) => {
                    return {
                        hruid: node.learningobject_hruid,
                        version: node.version,
                        language: node.language,
                        transitions: node.transitions,
                        start_node: node.start_node,
                        aspect_ratio: node.aspect_ratio,
                        available: node.available,
                        content_type: node.content_type,
                        created_at: node.created_at,
                        description: node.description,
                        difficulty: node.difficulty,
                        educational_goals: node.educational_goals,
                        estimated_time: node.estimated_time,
                        keywords: node.keywords,
                        license: node.license,
                        return_value: node.return_value,
                        skos_concepts: node.skos_concepts,
                        target_ages: node.target_ages,
                        title: node.title,
                        updatedAt: node.updatedAt,
                    }
                })

            }
            dispatch(
                setActiveLearningPath(lp)
            );
            // TODO: Set current step based on user progress
            dispatch(
                fetchLearningObject(lp.nodes[0])
            );
        }, {}, msg("Failed to fetch learning path details")
    )
}

const fetchLearningObject = (learningObjectId: LearningObjectId) => {
    return async (dispatch, getState) => {
        let learningObject = getState().activeLearningPath.activeLearningPath.path.nodes.find(
            (node: any) => {
                return node.hruid === learningObjectId.hruid &&
                node.version === learningObjectId.version &&
                node.language === learningObjectId.language
            }
        )
        let shouldSend = !("htmlContent" in learningObject && learningObject.htmlContent === undefined && learningObject.htmlContent === "")
        if (!shouldSend){
            dispatch(setCurrentStep(learningObject))
        }
        dispatch(loading());
        try {
            let url = `${globalSettings.learningObjectAPIBasePath}/api/learningObject/getRaw?hruid=${
                learningObjectId.hruid
            }&version=${
                learningObjectId.version
            }&language=${
                learningObjectId.language
            }`
            let request: RequestInit = {
                method: "GET",
                headers: { "Content-Type": "application/html" },
            };
            const response = await fetch(url, request);
            let html = await response.text();
            dispatch(setCurrentStep(learningObjectId))
            dispatch(setCurrentStepContent(html))
        } catch (err) {
            dispatch(
                setNotificationMessage(
                    msg("Failed to fetch learning object"),
                    NotificationMessageType.ERROR,
                    2500
                )
            );
        } finally {
            dispatch(doneLoading());
        }
    }
}

const { setActiveLearningPath, setLearningObjectSolution, removeLearningObjectSolution, setCurrentStep, setCurrentStepContent } = activeLearningPathSlice.actions
const activeLearningPathReducer = activeLearningPathSlice.reducer

export { emptyActiveLearningPath, fetchLearningPathDetails, activeLearningPathReducer, fetchLearningObject, setActiveLearningPath, setLearningObjectSolution, removeLearningObjectSolution, setCurrentStep, ActiveLearningPath }
