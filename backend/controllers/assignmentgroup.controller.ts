import { AssignmentGroup, IAssignmentGroup } from "../models/assignment_group.model.js"
import { ClassGroup } from "../models/class_group.model.js"
import { StudentTeam } from "../models/student_team.model.js"
import { User } from "../models/user.model.js"

class AssignmentGroupController {
    constructor() {

    }

    // TODO: check to filter out unneeded data from assignments 
    async all(req, res){
        try{
            let classGroupUUID = req.params.classGroupUUID
            let teacher = await User.findOne({userId: req.userId, platform: req.platform})
            let classGroup = await ClassGroup.findOne({
                uuid: classGroupUUID, 
                ownedBy: {
                    $in: [ teacher._id ]
                }
            })
            let assignments = await AssignmentGroup.find({
                inClassGroup: classGroup._id
            }).populate({
                path: "studentTeams",
                populate: {
                    path: "students",
                    model: "User"
                }
            })
            console.log(assignments)
            res.status(200).json(assignments)
        } catch (e) {
            res.status(500).send({message: "Unable to create assignment"})
        }
    }

    // TODO: continue here one monday.
    async createForClassGroup(req, res){
        try{
            let classGroupUUID = req.params.classGroupUUID
            let teacher = await User.findOne({userId: req.userId, platform: req.platform})
            console.log(classGroupUUID)
            let classGroup = await ClassGroup.findOne({
                uuid: classGroupUUID, 
                ownedBy: {
                    $in: [ teacher._id ]
                }
            })
            let assignment = new AssignmentGroup({
                inClassGroup: classGroup._id,
                name: req.body.name, 
                studentTeams: req.body.studentTeams.map((team) => {
                    return new StudentTeam(
                        {
                            name: team.name,
                            students: team.students.map((student) => {
                                return User.findOne({uuid: student.uuid})
                            })
                        }
                    )
                }),
                description: req.body.description,
                starred: req.body.starred,
            })
            let savedAssignment = await assignment.save()
            console.log(savedAssignment)
            res.status(200).json({message: "Assignment successfuly created", uuid: savedAssignment.uuid})
        } catch (e) {
            res.status(500).send({message: "Unable to create assignment"})
        }
    }

    async delete(req, res){
        let assignmentUUID = req.params.uuid
        try{
            let bybyGroup = await AssignmentGroup.findOne({uuid: assignmentUUID})
            await bybyGroup.deleteOne()
            res.status(200).send({message: "Assignment succesfully deleted."})
        } catch (e) {
            res.status(500).send({message: "An error occured when removing the assignment"})
        }
        
    }
}

export { AssignmentGroupController }