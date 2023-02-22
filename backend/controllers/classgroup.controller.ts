import { ClassGroup, IClassGroup } from "../models/class_group.model.js";
import { User } from "../models/user.model.js"
import { makeSharingCode } from "../utils/utils.js";

let getUniqueClassCode = async () => {
    let found = false
    let code = ""
    let iter = 0
    while (!found && iter < 10000) {
        code = makeSharingCode()
        let exists = await ClassGroup.exists({sharingCode: code})
        if (!exists){
            found = true;
        }
        iter++
    }
    return code
}

let getClassGroupForUser = async (userId, platform, classGroupUUID) => {
    let user = await User.findOne({userId: userId, platform: platform})
    let classGroup = await ClassGroup.findOne({
        ownedBy: {
            $in: [ user._id ]
        },
        uuid: classGroupUUID
    })
    return classGroup
}

class ClassGroupController {
    constructor() {

    }

    async all(req, res){
        try {
            let user = await User.findOne({
                userId: req.userId,
                platform: req.platform
            })
            let classGroups = await ClassGroup.aggregate([
                {
                    $match: {
                        ownedBy: {
                            $in: [ user._id ]
                        }
                    }
                }
            ])
            res.status(200).json(classGroups)
        } catch (err) {
            console.log(err)
            res.status(500).send()
        }
    }

    async add(req, res){
        try {
            let user = await User.findOne({userId: req.userId, platform: req.platform})
            let sharingCode = await getUniqueClassCode()
            const cg: IClassGroup = {
                name: req.body.name,
                description: req.body.description,
                sharingCode: sharingCode,
                ownedBy: [user._id],
                awaitingStudents: [],
                students: []
            }
            let classGroup = new ClassGroup(cg)
            cg.uuid = classGroup.uuid
            await classGroup.save()
            res.status(200).json(cg)
        } catch (err) {
            console.log(err)
            res.status(500).send("Failed to create classgroup")
        }
    }

    async delete(req, res){
        try {
            let user = await User.findOne({userId: req.userId, platform: req.platform})
            await ClassGroup.findOneAndRemove({
                ownedBy: {
                    $in: [ user._id ]
                },
                uuid: req.params.uuid
            })
            res.status(200).send()
        } catch (err) {
            console.log(err)
            res.status(500).send("Failed to remove classgroup")
        }
    } 

    

    async get(req, res){
        try {
            let classGroup = await getClassGroupForUser(req.userId, req.platform, req.params.uuid)
            classGroup = await classGroup.populate(["ownedBy", "students", "awaitingStudents"])
            classGroup = await (await (await classGroup
                .populate("ownedBy", ["firstname", "lastname", "uuid"]))
                .populate("students", ["firstname", "lastname", "uuid"]))
                .populate("awaitingStudents", ["firstname", "lastname", "uuid"])
            res.status(200).json(classGroup)
        } catch (err) {
            console.log(err)
            res.status(500).send("Failed to get classgroup")
        }
    }

    async getStudents(req, res) {
        try {
            let classGroup = await getClassGroupForUser(req.userId, req.platform, req.params.uuid)
            res.status(200).json(classGroup)
        } catch (err) {
            console.log(err)
            res.status(500).send("Failed to get classgroup")
        }
    }

    async getPending(req, res) {

    }
}

export { ClassGroupController }