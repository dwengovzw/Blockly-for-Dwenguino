import { IUserDoc, User } from "../models/user.model"
import { ISavedProgramDoc, SavedProgram } from "../models/saved_program.model"
import { processStartBlocks } from "../routes/blockly-routes"
import { ISavedProgram } from "../models/saved_program.model"
import { PortfolioItem } from "../models/portfolio_items/portfolio_item.model"
import { BlocklyProgramItem } from "../models/portfolio_items/blockly_program.model"
import { getAllPortfoliosOwnedByUser, getAllPortfoliosSharedWithUser } from "../queries/aggregation"
import { PopulatedDoc } from "mongoose"

class SavedProgramController {
    constructor(){

    }

    async save(req, res){
        let reqData = req.body
        try {
            let prog
            if (req.body.uuid){
                prog = await SavedProgram.findOneAndUpdate({
                    uuid: req.body.uuid,
                    user: req.user._id
                }, {
                    blocklyXml: reqData.program,
                    savedAt: new Date(),
                    //name: reqData.name //TODO: Add field to frontend to change current name
                })
                return res.status(200).send({message: "Saved program"})
            } else {
                prog = new SavedProgram({
                    blocklyXml: reqData.program,
                    savedAt: new Date(),
                    name: reqData.name,
                    user: req.user._id,
                    inPortfolio: false,
                    inSavedItemList: true
                })
                let savedProg = await prog.save()
                return res.status(302).send({message: "Saved new program", redirectUrl: `${process.env.SERVER_URL}/savedprograms/open?uuid=${savedProg.uuid}`})
            }
            
        } catch (err){
            return res.status(500).send({message: "Unable to retrieve user"})
        }
    }

    async delete(req, res) {
        try {
            let user = await User.findOne({userId: req.userId, platform: req.platform})
            await SavedProgram.findOneAndRemove({
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
        let userId = req.userId
        let platform = req.platform
        if (userId && platform){
            try{
                let user = await User.findOne({
                    platform: platform,
                    userId: userId
                })
                let savedPrograms = await SavedProgram.find({user: user._id, inPortfolio: false, inSavedItemList: true})
                res.status(200).json(savedPrograms)
            } catch (e){
                res.status(500).send({message: "Unable to fetch saved programs"})
            }
        } else {
            res.status(401).send({message: "Unable to fetch saved programs"})
        }
    }

    async open(req, res){
        let userId = req.userId
        let platform = req.platform
        let uuid = req.query.uuid
        if (userId && platform){
            try{
                let user = await User.findOne({
                    platform: platform,
                    userId: userId
                }) as IUserDoc
                let savedProgram = await SavedProgram.findOne({uuid: uuid}).populate<IUserDoc>({path: "user", model: "User"})
                const portfoliosOwnedByUser = await getAllPortfoliosOwnedByUser(user._id)
                const portfoliosSharedWithUser = await getAllPortfoliosSharedWithUser(user._id)
                const portfoliosWithAllowedAccess = [...portfoliosOwnedByUser, ...portfoliosSharedWithUser]//.map(p => p.items).flat().map(i => i._id)
                const portfolioItemIdsWithAllowedAccess = portfoliosWithAllowedAccess.map(p => p.items).flat().map(i => i._id)
                const portfolioItemsSavedProgramIdsWithAllowedAccess = (await BlocklyProgramItem.find({_id: {$in: portfolioItemIdsWithAllowedAccess}})
                    .populate<ISavedProgram>({path: "savedProgram", model: "SavedProgram"}))
                    .map(i => (i.savedProgram as ISavedProgramDoc).id)
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
        } else {
            res.status(401).send({message: "Unable to fetch saved programs"})
        }
    }
}

export default SavedProgramController