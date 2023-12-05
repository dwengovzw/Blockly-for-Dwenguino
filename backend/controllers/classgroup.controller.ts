import { ClassGroup, IClassGroup } from "../models/class_group.model";
import { User } from "../models/user.model"
import { makeSharingCode } from "../utils/utils"




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

/**
 * Get classgroup with UUID classGroupUUID and check if the requesting user is the owner
 * @param userId 
 * @param platform 
 * @param classGroupUUID 
 * @returns 
 */
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

    /**
     * Get all classgroups owned by a teacher
     * @param req 
     * @param res 
     */
    // TODO: check to filter out unneeded data from classes 
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
            res.status(500).send({message: "Failed to get classgroups"})
        }
    }

    /**
     * Add a classgroup with the current logged in user as owner
     * @param req 
     * @param res 
     */
    async add(req, res){
        try {
            let user = await User.findOne({userId: req.userId, platform: req.platform})
            let sharingCode = await getUniqueClassCode()
            const cg: IClassGroup = {
                name: req.body.name,
                description: req.body.description,
                createdAt: new Date(),
                sharingCode: sharingCode,
                ownedBy: [user._id],
                awaitingStudents: [],
                students: []
            }
            let classGroup = new ClassGroup(cg)
            cg.uuid = classGroup.uuid
            await classGroup.save()
            res.status(200).json({message: "Classgroup successfuly created"})
        } catch (err) {
            console.log(err)
            res.status(500).send("Failed to create classgroup")
        }
    }

    /**
     * Delete a classgroup, only possible if the logged in user is one of the owners of the group.
     * @param req 
     * @param res 
     */
    async delete(req, res){
        try {
            let user = await User.findOne({userId: req.userId, platform: req.platform})
            await ClassGroup.findOneAndDelete({
                ownedBy: {
                    $in: [ user._id ]
                },
                uuid: req.params.uuid
            })
            res.status(200).send({message: "Classgroup successfuly removed"})
        } catch (err) {
            console.log(err)
            res.status(500).send("Failed to remove classgroup")
        }
    } 

    /**
     * Get a specific classgroup based on its uuid, check ownership and populate its fields
     * @param req 
     * @param res 
     */
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

    /**
     * Get all the class groups for a student (both approved and pending)
     * @param req 
     * @param res 
     */
    async mine(req, res) {
        try {
            let user = await User.findOne({userId: req.userId, platform: req.platform})
            let classGroups = await ClassGroup.find({
                students: {
                    $in: [ user._id ]
                }
            }).select("name description uuid")
            let pendingClassGroups = await ClassGroup.find({
                awaitingStudents: {
                    $in: [ user._id ]
                }
            }).select("name description uuid")
            res.status(200).json({
                    classGroups: classGroups,
                    pendingClassGroups: pendingClassGroups
            })
        } catch (e) {
            res.status(500).send("Error requesting class groups.")
        }
        
    }

    /**
     * A student removes itself from a class group.
     * @param req 
     * @param res 
     */
    async leave(req, res) {
        try {
            let user = await User.findOne({userId: req.userId, platform: req.platform})
            let uuid = req.params.uuid
            let classGroup = await ClassGroup.findOne({uuid: uuid})
            let indexToRemove = classGroup.students.indexOf(user._id)
            if (indexToRemove !== -1) {
                classGroup.students.splice(indexToRemove, 1)
            }
            indexToRemove = classGroup.awaitingStudents.indexOf(user._id)
            if (indexToRemove !== -1) {
                classGroup.awaitingStudents.splice(indexToRemove, 1)
            }
            classGroup.save()
            res.status(200).send({message: "Left classgroup"})
        } catch (e) {
            res.status(500).send("Error requesting class groups.")
        }
    }

    /**
     * A student joins a classgroup using its sharingcode
     * @param req 
     * @param res 
     */
    async join(req, res) {
        try {
            let student = await User.findOne({userId: req.userId, platform: req.platform})
            let sharingCode = req.params.sharingCode
            let classGroup = await ClassGroup.findOne({sharingCode: sharingCode})
            classGroup.awaitingStudents.push(student._id)
            classGroup.save()
            res.status(200).send({message: "Joined classgroup awaiting approval."})
        } catch (e) {
            res.status(500).send({message: "Error joining class groups."})
        }
    }

    /**
     * Router wrapper to return router function with approval parameter.
     * @param approve 
     * @returns 
     */
    changeApprovalStatusRouterWrapper(approve: boolean){
        return (req, res, next) => {
            this.changeApprovalStatus(req, res, approve)
        }
    }

    /**
     * Approve or reject a student that has joined a class group.
     * @param req 
     * @param res 
     * @param approve 
     * @returns 
     */
    async changeApprovalStatus(req, res, approve: boolean) {
        try {
            let classUuid = req.params.uuid
            let studentUuid = req.params.studentUuid
            let teacher = await User.findOne({userId: req.userId, platform: req.platform})
            let student = await User.findOne({uuid: studentUuid})
            let classGroup = await ClassGroup.findOne({
                uuid: classUuid, 
                ownedBy: {
                    $in: [ teacher._id ]
                }
            })
            let index = classGroup.awaitingStudents.indexOf(student._id)
            if (index === -1){
                return res.status(500).send({message: "Student not in approval list."})
            }
            classGroup.awaitingStudents.splice(index, 1)  // Remove student from awaiting list
            if (approve){
                classGroup.students.push(student._id)  // Add the student to the students list if approved
            }
            classGroup.save()
            res.status(200).send({message: "Successfuly approved student"})
        } catch (e) {
            res.status(500).send({message: "Unable to approve student"})
        }
    }

    async deleteStudent(req, res){
        try {
            let classUuid = req.params.uuid
            let studentUuid = req.params.studentUuid
            let teacher = await User.findOne({userId: req.userId, platform: req.platform})
            let student = await User.findOne({uuid: studentUuid})
            let classGroup = await ClassGroup.findOne({
                uuid: classUuid, 
                ownedBy: {
                    $in: [ teacher._id ]
                }
            })
            let index = classGroup.students.indexOf(student._id)
            if (index === -1){
                return res.status(500).send({message: "Student not in classgroup."})
            }
            classGroup.students.splice(index, 1)  // Remove student from students list

            classGroup.save()
            res.status(200).send({message: "Successfuly approved student"})
        } catch (e) {
            res.status(500).send({message: "Unable to approve student"})
        }
    }

    /**
     * 
     * @param req 
     * @param res 
     */
    async getStudents(req, res) {
        res.status(500).send({message: "Not implemented"})
    }

    async getPending(req, res) {
        res.status(500).send({message: "Not implemented"})
    }
}

export { ClassGroupController }