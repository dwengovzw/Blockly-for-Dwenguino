import ROLES from "./db.config.js"

export const ITEMTYPES = {
    AnnotatedDrawing: "AnnotatedDrawing",
    BlocklyQuestion: "BlocklyQuestion",
    BlocklyProgSequenceItem: "BlocklyProgSequenceItem",
    OpenQuestion: "OpenQuestion",
    SolutionItem: "SolutionItem",
    TextItem: "TextItem",
    MCAnswerItem: "MCAnswerItem",
    MCQuestionItem: "MCQuestionItem",
    PortfolioItem: "PortfolioItem",
    SocialRobotDesignItem: "SocialRobotDesignItem",
};

export const ALLOWEDITEMS = {
    [ROLES.user]: [ITEMTYPES.TextItem],
    [ROLES.student]: [ITEMTYPES.MCAnswerItem, ITEMTYPES.SocialRobotDesignItem, ITEMTYPES.AnnotatedDrawing, ITEMTYPES.BlocklyProgSequenceItem],
    [ROLES.teacher]: [ITEMTYPES.MCQuestionItem, ITEMTYPES.OpenQuestion, ITEMTYPES.BlocklyQuestion],
}

export const getAllowedItemsForRoles = (roles) => {
    return roles.map(role => ALLOWEDITEMS[role]).flat()
}
