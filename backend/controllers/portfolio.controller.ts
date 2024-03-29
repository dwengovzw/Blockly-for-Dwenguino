import { IPortfolio, Portfolio } from "../models/portfolio.model"
import { PortfolioItem } from "../models/portfolio_items/portfolio_item.model";
import { TextItem } from "../models/portfolio_items/text_item.model";
import { getAllPortfoliosOwnedByUser, getAllPortfoliosSharedWithUser, getPortfoliosForFilter } from "../queries/aggregation";
import { ALLOWEDITEMS, ITEMTYPES, getAllowedItemsForRoles } from "../config/itemtypes.config";
import { BlocklyProgSequenceItem } from "../models/portfolio_items/blockly_programming_sequence.model";
import { SocialRobotDesignItem } from "../models/portfolio_items/social_robot_design_item.model";
import { AnnotatedDrawingItem } from "../models/portfolio_items/annotated_drawing.model";
import { BlocklyProgramItem } from "../models/portfolio_items/blockly_program.model";
import { SavedState } from "../models/saved_state.model";

// TODO: I might need to update this depending on the data we want to request (f.e. startDate, endDate, description keyword, ..)
interface PortfolioFilter {
    uuid?: string,
    isPublic?: boolean,
    sharedWithUUID?: string[],
    ofStudentsUUID?: string[],
    ofStudentTeamsUUID?: string[],
    startDate?: Date,
    endDate?: Date
}

class PortfolioController {
   
    filter = async (req, res) => {
        try {
            let filter: PortfolioFilter = req.body
            // Get the users that match the sharedWithUUIDs
            const portfolios = await getPortfoliosForFilter(filter)
            res.status(200).send(portfolios)
        } catch (e) {
            res.status(500).send("Error filtering portfolios.")
        }
    }

    mine = async (req, res) => {
        try{
            const portfolios = await getAllPortfoliosOwnedByUser(req.user._id)
            res.status(200).send(portfolios)
        } catch (e) {
            res.status(500).send("Error requesting portfolios.")
        }
    }

    sharedWithMe = async (req, res) => {
        try {
            let user = req.user
            const portfolios = await getAllPortfoliosSharedWithUser(user._id)
            res.status(200).send(portfolios)
        } catch (e) {
            res.status(500).send("Error requesting portfolios.")
        }
    }

    // TODO remove _id and __v from the response
    get = async (req, res) => {
        try {
            let portfolio = await Portfolio.findOne({uuid: req.params.uuid})
                .populate({path: "items", populate: [
                    {path: "children"},
                    {
                        path: "savedProgram",
                        strictPopulate: false,
                        match: { savedProgram: { $exists: true } }, // Filter items without savedProgram
                    }
                ]})
                .populate("sharedWith")
            if (!portfolio){
                res.status(404).send({message: "Portfolio not found."})
                return
            }
            res.status(200).send(portfolio)
        } catch (e) {
            res.status(500).send("Error requesting portfolio.")
        }
    }

    checkIfUserHasAccessToPortfolio = async (req, res, next) => {
        try {
            const uuid = req.params.uuid || req.body.uuid
            if (!uuid){ // If the portfolio uuid is not specified, skip this middleware => the user is creating a new portfolio
                res.status(404).send({message: "Portfolio not found."})
                return
            }
            // Get the porfolio for the given uuid
            let portfolio = await Portfolio.findOne({uuid: uuid}).populate<IPortfolio>("items")
            if (!portfolio){ // If the portfolio does not exist, return an error
                res.status(404).send({message: "Portfolio not found."})
                return
            }
            // Check if the user owns the portfolio or if the portfolio is shared with the user
            const portfoliosOwnedByUser = (await getAllPortfoliosOwnedByUser(req.user._id)).filter(portfolio => portfolio.uuid === uuid)
            const portfoliosSharedWithUser = (await getAllPortfoliosSharedWithUser(req.user._id)).filter(portfolio => portfolio.uuid === uuid)
            if (portfoliosOwnedByUser.length === 0 && portfoliosSharedWithUser.length === 0){ // If the user does not own the portfolio and the portfolio is not shared with the user, return an error
                res.status(403).send({message: "User does not have access to the portfolio."})
                return
            }
            next() // If the user owns the portfolio, continue
        } catch (e) {
            res.status(500).send("Error checking if user owns portfolio.")
        }
    }

    checkIfUserCanCreateItemType = async (req, res, next) => {
        try {
            const allowedItemTypes = getAllowedItemsForRoles(req.user.roles.map(role => role.name))
            if (!allowedItemTypes.includes(req.body.__t)){
                res.status(403).send({message: "User does not have access to create this item."})
                return
            }
            next()
        } catch (e) {
            res.status(500).send("Error checking if user can create item.")
        }
    }

    createItem = async (req, res) => {
        try {
            let portfolio = await Portfolio.findOne({uuid: req.params.uuid})
            if (!portfolio){
                res.status(404).send({message: "Portfolio not found."})
                return
            }
            let item
            // TODO: Add other item types + rethink this. Maybe use a factory pattern?
            if (req.body.__t === ITEMTYPES.AnnotatedDrawing){
                item = new AnnotatedDrawingItem()
            } else if (req.body.__t === ITEMTYPES.TextItem) {
                item = new TextItem()
            } else if (req.body.__t === ITEMTYPES.SocialRobotDesignItem){
                item = new SocialRobotDesignItem()
            } else if (req.body.__t === ITEMTYPES.BlocklyProgSequenceItem) {
                item = new BlocklyProgSequenceItem()
            } else if (req.body.__t === ITEMTYPES.BlocklyProgram) {
                const newSavedState = new SavedState()
                newSavedState.name = "New program"
                newSavedState.savedAt = new Date()
                newSavedState.user = req.user._id
                newSavedState.inPortfolio = true
                newSavedState.inSavedItemList = false
                await newSavedState.save()
                item = new BlocklyProgramItem()
                item.savedState = newSavedState._id
            } else {
                res.status(404).send({message: "Item type not found."})
            }
            item = Object.assign(item, req.body)
            item = await item.save()
            item = await item.populate({path: "children"})
            if (req.body.__t === ITEMTYPES.BlocklyProgram){
                item = await item.populate({path: "savedState", model: "SavedState"})
            }
            portfolio.items.push(item)
            portfolio = await portfolio.save()
            res.status(200).send(item)
        } catch (e) {
            res.status(500).send("Error creating item.")
        }
    }

    /**
     * Creates a new portfolio
     * @param req
     * @param res
     * @returns {Promise<void>}
     * @memberof PortfolioController
        */
    saveItem = async (req, res) => {
        try {
            let item = await PortfolioItem.findOne({uuid: req.body.uuid})
            if (!item){
                res.status(404).send({message: "Item not found."})
                return
            }
            item = Object.assign(item, req.body) 
            if (!item){
                res.status(404).send({message: "Error updating item"})
                return
            }
            item = await item.save()
            item = await item.populate([
                {path: "children"},
                {
                    path: "savedProgram",
                    strictPopulate: false,
                    match: { savedProgram: { $exists: true } }, // Filter items without savedProgram
                }])
            res.status(200).send(item)
        } catch (e) {
            res.status(500).send("Error saving item.")
        }
    }

    deleteItem = async (req, res) => {
        try {
            let item = await PortfolioItem.findOne({uuid: req.params.itemUUID})
            if (!item){
                res.status(404).send({message: "Item not found."})
                return
            }
            // Remove the item from the items array of all portfolios that have this item
            await Portfolio.updateMany(
                {items: {$in: [item._id]}},
                {$pull: {items: item._id}}
            )
            // Remove the item from the children array of all items that have this item as a child
            await PortfolioItem.updateMany(
                {children: {$in: [item._id]}},
                {$pull: {children: item._id}}
            )
            // Remove the item from the database
            await item.deleteOne()
            res.status(200).send({message: "Item deleted."})
        } catch (e) {
            res.status(500).send("Error deleting item.")
        }
    }
}

export { PortfolioController, PortfolioFilter }