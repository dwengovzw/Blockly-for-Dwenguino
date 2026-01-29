// shared/types/portfolio.ts

import { MinimalUserInfo } from "./user.js"
import { LogItemInfo } from "./log_item.js"
import { SavedStateInfo } from "./saved_state.js"


// TODO: I might need to update this depending on the data we want to request (f.e. startDate, endDate, description keyword, ..)
export interface PortfolioFilter {
    uuid?: string,
    isPublic?: boolean,
    sharedWithUUID?: string[],
    ofStudentsUUID?: string[],
    ofStudentTeamsUUID?: string[],
    startDate?: Date,
    endDate?: Date
}

export interface MinimalPortfolioItemInfo {
    name: string
    __t: string
    children: PortfolioItemInfo[]
}

export interface MinimalDisplayedPortfolioItemInfo extends MinimalPortfolioItemInfo {
    displayInformation: IPortfolioItemDisplayInformation
}

export interface PortfolioItemInfo extends MinimalDisplayedPortfolioItemInfo {
    uuid: string
    needsTeacherAttention: boolean
    needsStudentAttention: boolean
}

export interface SolutionItemInfo extends PortfolioItemInfo {
    solutionTo: PortfolioItemInfo | string
}

export interface AssignmentItemInfo extends PortfolioItemInfo {
    ownedBy: MinimalUserInfo | string
}

export interface AnnotatedDrawingItemInfo extends SolutionItemInfo {
    annotations: string[]
}

export interface BlocklyProgSequenceItemInfo extends SolutionItemInfo {
    eventSequence: LogItemInfo[]
}

export interface BlocklyProgramItemInfo extends SolutionItemInfo {
    savedState: SavedStateInfo
}

export interface TextItemInfo extends SolutionItemInfo {
    mdText: string
}

export interface SocialRobotDesignItemInfo extends SolutionItemInfo {
    socialRobotDesignXml: string
}

export interface OpenQuestionItemInfo extends AssignmentItemInfo {
    questionText: string
}

export interface MCQuestionItemInfo extends AssignmentItemInfo {
    questionText: string
    answerOptions: string[]
    correctAnswers: number[]
}

export interface MCAnswerItemInfo extends SolutionItemInfo {
    selectedAnswer: number
}

export interface BlocklyQuestionItemInfo extends AssignmentItemInfo {
    questionText: string
}

export interface PortfolioInfo {
    uuid: string
    name: string
    description: string
    created: Date
    lastEdited: Date
    isPublic: boolean
    folder?: string
    items: PortfolioItemInfo[]
    sharedWith: MinimalUserInfo[]
    shared?: boolean
    ownedBy?: string[]
}

// Minimal frontend representation of backend display info
export interface IPortfolioItemDisplayInformation {
    x: number
    y: number
    width?: number
    height?: number
}
