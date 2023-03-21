import { AssignmentGroup, IAssignmentGroup } from "../models/assignment_group.model.js"
import { ClassGroup } from "../models/class_group.model.js"
import { IStudentTeam, StudentTeam } from "../models/student_team.model.js"
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

    /*updateStudentTeams(currentTeams: IStudentTeam[], newTeams: IStudentTeam[]){
        if (currentTeams.length <= newTeams.length){    // There were 0 or more new teams added
            //Add extra teams to teams list
            for (let i = 0 ; i < newTeams.length - currentTeams.length ; ++i){
                let newTeam:IStudentTeam ={
                    portfolio: null,
                    students: []
                } 
                currentTeams.push()
            }
        } else { // There was at least one team removed
            for (let i = 0 ; i < currentTeams.length - newTeams.length ; i++){
                let team = currentTeams.pop()
                StudentTeam.deleteOne({uuid: team.uuid})
            }
        }
        // Update the existing items that stay the same
        return await Promise.all(currentTeams.map(async (item, index) => {
            item.uuid = newTeams[index].uuid
            item.students = await Promise.all(newTeams[index].students.map( async (student) => {
                let s = await User.findOne({uuid: student.uuid})
                return s._id
            }))
        }))
    }*/

    // TODO: continue here one monday.
    async createForClassGroup(req, res){
        try{
            let classGroupUUID = req.params.classGroupUUID
            let teacher = await User.findOne({userId: req.userId, platform: req.platform})
            let classGroup = await ClassGroup.findOne({
                uuid: classGroupUUID, 
                ownedBy: {
                    $in: [ teacher._id ]
                }
            })
            /*let assignment = await AssignmentGroup.findOne({uuid: req.body.uuid})
            if (assignment){
                assignment = new AssignmentGroup()
            }
            assignment.inClassGroup = classGroup._id
            assignment.studentTeams = this.updateStudentTeams(assignment.studentTeams as IStudentTeam[], req.body.studentTeams)*/


            let assignment = new AssignmentGroup({
                inClassGroup: classGroup._id,
                studentTeams: await Promise.all(req.body.studentTeams.map( async (team) => {
                    let st = new StudentTeam(
                        {
                            students: await Promise.all(team.students.map( async (student) => {
                                let s = await User.findOne({uuid: student.uuid})
                                return s._id
                            }))
                        }
                    )
                    return (await st.save())._id
                })),
                name: req.body.name,
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