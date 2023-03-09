import { User } from "../models/user.model.js"
import { SavedProgram } from "../models/saved_program.model.js"
import { processStartBlocks } from "../routes/blockly-routes.js"

class SavedProgramController {
    constructor(){

    }

    async save(req, res){
        let userId = req.userId
        let platform = req.platform
        let reqData = req.body
        if (userId && platform){
            try {
                let user = await User.findOne({
                    platform: platform,
                    userId: userId
                })
                let prog = new SavedProgram({
                    blocklyXml: reqData.program,
                    savedAt: new Date(),
                    name: reqData.name,
                    user: user._id
                })
                prog.save()
                return res.status(200).send("")
            } catch (err){
                return res.status(500).send({message: "Unable to retrieve user"})
            }
        } else {
            return res.status(500).send({message: "Cannot get user info"})
        }
    }

    async delete(req, res) {
        try {
            let user = await User.findOne({userId: req.userId, platform: req.platform})
            await SavedProgram.findOneAndRemove({
                user: user._id,
                uuid: req.params.uuid
            })
            res.status(200).send()
        } catch (err) {
            console.log(err)
            res.status(500).send("Failed to remove saved program")
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
                res.status(500).send("Unable to fetch saved programs")
            }
        } else {
            res.status(401).send("Unable to fetch saved programs")
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
                processStartBlocks(savedProgram.blocklyXml, res)
            } catch (e){
                res.status(500).send("Unable to fetch saved programs")
            }
        } else {
            res.status(401).send("Unable to fetch saved programs")
        }
    }
}

export default SavedProgramController