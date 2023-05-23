import { User } from "../models/user.model"
import { SavedProgram } from "../models/saved_program.model"
import { processStartBlocks } from "../routes/blockly-routes"

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
                    user: req.user._id
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

    async all(req, res){
        let userId = req.userId
        let platform = req.platform
        if (userId && platform){
            try{
                let user = await User.findOne({
                    platform: platform,
                    userId: userId
                })
                let savedPrograms = await SavedProgram.find({user: user._id})
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
                })
                let savedProgram = await SavedProgram.findOne({user: user._id, uuid: uuid})
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