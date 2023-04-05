import { msg } from "@lit/localize"
import { createSlice } from "@reduxjs/toolkit"
import { setNotificationMessage, NotificationMessageType, loading, doneLoading } from "./notification_slice"
import { MinimalUserInfo } from "./user_slice"
import { createRequestMiddleware } from "../../middleware/fetch"
import { StudentTeamInfo } from "./student_team_slice"
import { PortfolioFilter } from "../../../../../../backend/controllers/portfolio.controller"

interface MinimalPortfolioItemInfo {
    name: string,
    __t: string,
}

interface PortfolioItemInfo extends MinimalPortfolioItemInfo {
    uuid: string,
}

interface SolutionItemInfo extends PortfolioItemInfo {
    solutionTo: PortfolioItemInfo | string // Contains reference to item itself or the _id of the item
}

interface AssignmentItemInfo extends PortfolioItemInfo {
    ownedBy: MinimalUserInfo | string
}

interface AnnotatedDrawingItemInfo extends SolutionItemInfo {
    annotations: string[]
}

interface BlocklyProgSequenceItemInfo extends SolutionItemInfo {
    eventSequence: string[] // TODO: replace type with LogItemInfo[]
}

interface TextItemInfo extends SolutionItemInfo {
    mdText: string
}

interface SocialRobotDesignItemInfo extends SolutionItemInfo {
    socialRobotDesignXml: string
}

interface OpenQuestionItemInfo extends AssignmentItemInfo {
    questionText: string
}

interface MCQuestionItemInfo extends AssignmentItemInfo {
    questionText: string,
    answerOptions: string[],
    correctAnswers: number[]
}

interface MCAnswerItemInfo extends SolutionItemInfo {
    selectedAnswer: number
}

interface BlocklyQuestionItemInfo extends AssignmentItemInfo {
    questionText: string
}


interface PortfolioInfo {
    uuid: string,
    name: string,
    description: string,
    created: Date,
    lastEdited: Date,
    isPublic: boolean,
    folder?: string,
    items: PortfolioItemInfo[],
    sharedWith: MinimalUserInfo[],
    shared?: boolean
}

const selectedPortfolio: PortfolioInfo = {
    uuid: "",
    name: "",
    description: "",
    created: new Date(),
    lastEdited: new Date(),
    isPublic: false,
    items: [],
    sharedWith: [],
    shared: false
}
const portfolioList: PortfolioInfo[] = []

const initialPortfolioState = {
    selectedPortfolio: null,
    portfolioList: []
}

export const portfolioSlice = createSlice({
    name: "portfolio",
    initialState: initialPortfolioState,
    reducers: {
        setPortfolioList: (state, action) => {
            state.portfolioList = action.payload
        },
        setSelectedPortfolio: (state, action) => {
            state.selectedPortfolio = action.payload
        },
        setSelectedPortfolioItems: (state, action) => {
            if (state.selectedPortfolio){
                (state.selectedPortfolio as PortfolioInfo).items = action.payload
            }
        },
        updateSelectedPortfolioItem: (state, action) => {
            if (state.selectedPortfolio){
                let index = (state.selectedPortfolio as PortfolioInfo).items.findIndex(item => item.uuid === action.payload.uuid)
                if (index >= 0){
                    (state.selectedPortfolio as PortfolioInfo).items[index] = action.payload
                } else {
                    (state.selectedPortfolio as PortfolioInfo).items.push(action.payload)
                }
            }
        }
    }
})

const deletePortfolioItem = (portfolioUuid: string, itemUuid: string) => {
    return createRequestMiddleware(`${globalSettings.hostname}/portfolio/${portfolioUuid}/deleteItem/${itemUuid}`, "DELETE", (dispatch, getState, json) => {
        dispatch(getPortfolio(portfolioUuid))
    }, null, msg("Error while deleting portfolio item"))
}

const createPortfolioItem = (portfolioUuid: string, item: MinimalPortfolioItemInfo) => {
    return createRequestMiddleware(`${globalSettings.hostname}/portfolio/${portfolioUuid}/createItem`, "PUT", (dispatch, getState, json) => {
        console.log(json)
        dispatch(updateSelectedPortfolioItem(json))
    }, item, msg("Error while creating portfolio item"))
}

const savePortfolioItem = (portfolioUuid: string, item: MinimalPortfolioItemInfo) => {
    return createRequestMiddleware(`${globalSettings.hostname}/portfolio/${portfolioUuid}/saveItem`, "PUT", (dispatch, getState, json) => {
        console.log(json)
        dispatch(updateSelectedPortfolioItem(json))
    }, item, msg("Error while saving portfolio item"))
}

const getPortfolios = (filter: PortfolioFilter) => {
    return createRequestMiddleware(`${globalSettings.hostname}/portfolio/filter`, "POST", (dispatch, getState, json) => {
        console.log(json)
        dispatch(setPortfolioList(json))
    }, filter, msg("Error while fetching portfolios"))
}

const getMyPortfolios = () => {
    return createRequestMiddleware(`${globalSettings.hostname}/portfolio/mine`, "GET", (dispatch, getState, json) => {
        console.log(json)
        dispatch(setPortfolioList(json))
    }, null, msg("Error while fetching portfolios"))
}

const getPortfolio = (uuid: string) => {
    return createRequestMiddleware(`${globalSettings.hostname}/portfolio/${uuid}`, "GET", (dispatch, getState, json) => {
        console.log(json)
        dispatch(setSelectedPortfolio(json))
    }, null, msg("Error while fetching portfolio"))
}


const { setPortfolioList, setSelectedPortfolio, setSelectedPortfolioItems, updateSelectedPortfolioItem } = portfolioSlice.actions

const portfolioReducer = portfolioSlice.reducer

export { getPortfolios, getMyPortfolios, getPortfolio, PortfolioItemInfo, MinimalPortfolioItemInfo, portfolioReducer, PortfolioInfo, TextItemInfo, setSelectedPortfolioItems, savePortfolioItem, createPortfolioItem, deletePortfolioItem}