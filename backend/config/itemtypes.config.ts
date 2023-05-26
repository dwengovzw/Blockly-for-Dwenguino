import { ROLES } from "./db.config"

export const ITEMTYPES = {
    AnnotatedDrawing: "AnnotatedDrawing",
    BlocklyQuestion: "BlocklyQuestion",
    BlocklyProgram: "BlocklyProgram",
    BlocklyProgSequenceItem: "BlocklyProgSequenceItem",
    OpenQuestion: "OpenQuestion",
    SolutionItem: "SolutionItem",
    TextItem: "TextItem",
    MCAnswerItem: "MCAnswerItem",
    MCQuestionItem: "MCQuestionItem",
    PortfolioItem: "PortfolioItem",
    SocialRobotDesignItem: "SocialRobotDesignItem",
};

const ALLOWEDITEMTYPES_FOR_ITEMTYPE = {
    [ITEMTYPES.AnnotatedDrawing]: [ITEMTYPES.TextItem],
    [ITEMTYPES.BlocklyQuestion]: [ITEMTYPES.TextItem, ITEMTYPES.BlocklyProgram],
    [ITEMTYPES.BlocklyProgSequenceItem]: [ITEMTYPES.TextItem, ITEMTYPES.OpenQuestion, ITEMTYPES.MCQuestionItem, ITEMTYPES.BlocklyQuestion],
    [ITEMTYPES.BlocklyProgram]: [ITEMTYPES.TextItem, ITEMTYPES.OpenQuestion, ITEMTYPES.MCQuestionItem, ITEMTYPES.BlocklyQuestion],
    [ITEMTYPES.OpenQuestion]: [ITEMTYPES.TextItem],
    [ITEMTYPES.SolutionItem]: [],
    [ITEMTYPES.TextItem]: [ITEMTYPES.BlocklyProgram ,ITEMTYPES.TextItem, ITEMTYPES.OpenQuestion, ITEMTYPES.MCQuestionItem, ITEMTYPES.BlocklyQuestion],
    [ITEMTYPES.MCAnswerItem]: [ITEMTYPES.TextItem, ITEMTYPES.OpenQuestion, ITEMTYPES.MCQuestionItem, ITEMTYPES.BlocklyQuestion],
    [ITEMTYPES.MCQuestionItem]: [ITEMTYPES.MCAnswerItem],
    [ITEMTYPES.PortfolioItem]: [],
    [ITEMTYPES.SocialRobotDesignItem]: [/*ITEMTYPES.TextItem, */ITEMTYPES.OpenQuestion, ITEMTYPES.MCQuestionItem, ITEMTYPES.BlocklyQuestion],
}

export const ALLOWEDITEMS = {
    [ROLES.user]: [ITEMTYPES.TextItem, ITEMTYPES.BlocklyProgram],
    [ROLES.student]: [ITEMTYPES.MCAnswerItem, ITEMTYPES.SocialRobotDesignItem, ITEMTYPES.AnnotatedDrawing, ITEMTYPES.BlocklyProgSequenceItem],
    [ROLES.teacher]: [ITEMTYPES.MCQuestionItem, ITEMTYPES.OpenQuestion, ITEMTYPES.BlocklyQuestion],
    [ROLES.admin]: [],
}

export const getAllowedItemsForRoles = (roles) => {
    return roles.map(role => ALLOWEDITEMS[role]).flat()
}

export const getAllowedItemsForSourceItemType = (itemType) => {
    return ALLOWEDITEMTYPES_FOR_ITEMTYPE[itemType]
}
