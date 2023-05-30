import { IUserDoc, User } from "../models/user.model"
import { ISavedStateDoc, SavedState, emptyProgramXml, emptySocialRobotDesign } from "../models/saved_state.model"
import { processStartBlocks } from "../routes/blockly-routes"
import { ISavedState } from "../models/saved_state.model"
import { PortfolioItem } from "../models/portfolio_items/portfolio_item.model"
import { BlocklyProgramItem } from "../models/portfolio_items/blockly_program.model"
import { getAllPortfoliosOwnedByUser, getAllPortfoliosSharedWithUser } from "../queries/aggregation"
import { PopulatedDoc } from "mongoose"

class SavedStateController {
    constructor(){

    }

    async save(req, res){
        let reqData = req.body
        try {
            let prog
            if (req.body.uuid){
                prog = await SavedState.findOneAndUpdate({
                    uuid: req.body.uuid,
                    user: req.user._id
                }, {
                    blocklyXml: reqData.blocklyXml || emptyProgramXml,
                    cppCode: reqData.cppCode,
                    socialRobotXml: reqData.socialRobotXml || emptySocialRobotDesign,
                    view: reqData.view,
                    scenario: reqData.scenario,
                    savedAt: new Date(),
                    //name: reqData.name //TODO: Add field to frontend to change current name
                })
                return res.status(200).send({message: "Saved program"})
            } else {
                prog = new SavedState({
                    blocklyXml: reqData.blocklyXml || emptyProgramXml,
                    cppCode: reqData.cppCode,
                    socialRobotXml: reqData.socialRobotXml || emptySocialRobotDesign,
                    view: reqData.view,
                    scenario: reqData.scenario,
                    savedAt: new Date(),
                    name: reqData.name,
                    user: req.user._id,
                    inPortfolio: false,
                    inSavedItemList: true
                })
                let savedProg = await prog.save()
                return res.status(302).send({message: "Saved new program", redirectUrl: `${process.env.SERVER_URL}/savedstates/open?uuid=${savedProg.uuid}`})
            }
            
        } catch (err){
            return res.status(500).send({message: "Unable to retrieve user"})
        }
    }

    async delete(req, res) {
        try {
            let user = req.user as IUserDoc
            await SavedState.findOneAndRemove({
                user: user._id,
                uuid: req.params.uuid
            })
            res.status(200).send({message: "Saved program removed"})
        } catch (err) {
            console.log(err)
            res.status(500).send({message: "Failed to remove saved program"})
        }
    }

    // Get all saved items for current user that are not in a portfolio
    async all(req, res){
        try{
            let user = req.user
            let savedPrograms = await SavedState.find({user: user._id, inPortfolio: false, inSavedItemList: true})
            res.status(200).json(savedPrograms)
        } catch (e){
            res.status(500).send({message: "Unable to fetch saved programs"})
        }
    }

    async open(req, res){
        let uuid = req.query.uuid
        try{
            let user = req.user as IUserDoc
            let savedProgram = await SavedState.findOne({uuid: uuid}).populate<IUserDoc>({path: "user", model: "User"})
            const portfoliosOwnedByUser = await getAllPortfoliosOwnedByUser(user._id)
            const portfoliosSharedWithUser = await getAllPortfoliosSharedWithUser(user._id)
            const portfoliosWithAllowedAccess = [...portfoliosOwnedByUser, ...portfoliosSharedWithUser]//.map(p => p.items).flat().map(i => i._id)
            const portfolioItemIdsWithAllowedAccess = portfoliosWithAllowedAccess.map(p => p.items).flat().map(i => i._id)
            const portfolioItemsSavedProgramIdsWithAllowedAccess = (await BlocklyProgramItem.find({_id: {$in: portfolioItemIdsWithAllowedAccess}})
                .populate<ISavedState>({path: "savedProgram", model: "SavedProgram"}))
                .map(i => (i.savedState as ISavedStateDoc).id)
            if (!((savedProgram.user as IUserDoc).id === user.id || portfolioItemsSavedProgramIdsWithAllowedAccess.includes(savedProgram.id))){
                return res.status(401).send({message: "You do not have access to this program"})
            }
            processStartBlocks({
                startblock_xml: savedProgram.blocklyXml,
                res: res, 
                savedProgramUUID: uuid
            })
            
        } catch (e){
            res.status(500).send({message: "Unable to fetch saved programs"})
        }
    }
}

export default SavedStateController