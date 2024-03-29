import { Types } from "mongoose"
import { AssignmentGroup, IAssignmentGroup } from "../models/assignment_group.model"
import { ClassGroup } from "../models/class_group.model"
import { Portfolio } from "../models/portfolio.model"
import { IStudentTeam, StudentTeam } from "../models/student_team.model"
import { User, IUser, IUserDoc } from "../models/user.model"

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
            res.status(200).json(assignments)
        } catch (e) {
            res.status(500).send({message: "Unable to create assignment"})
        }
    }

    updateStudentTeams = async (currentTeams: IStudentTeam[], newTeams: IStudentTeam[], teacher: IUserDoc, assignmentName: string): Promise<Types.ObjectId[]> => {
        // Find the student teams that no longer exist = their uuid is not in the newTeams list
        let teamsToRemove = currentTeams.filter(team => {
            return !newTeams.map(newTeam => newTeam.uuid).includes(team.uuid)
        })
        // Remove them from the database
        for (const team of teamsToRemove){
            await StudentTeam.findOneAndDelete({uuid: team.uuid})
        }
        // Add new teams to the database
        let newTeamIds = []
        for (let newTeam of newTeams){
            let newTeamToSave
            if (newTeam.uuid){ // If team has uuid, it should exist
                newTeamToSave = await StudentTeam.findOne({uuid: newTeam.uuid})
                // No need to create portfolio here, should already exist.
            }
            if (!newTeamToSave){ // If team was new = no uuid, or not found => create new team
                newTeamToSave = new StudentTeam()
                let portfolioForTeam = await new Portfolio({
                    name: `${assignmentName}`,
                    sharedWith: teacher._id
                }).save() // Create new portfolio for this team
                newTeamToSave.portfolio = portfolioForTeam
            }
            // Update the students in this team
            newTeamToSave.students = await Promise.all(newTeam.students.map( async (student) => {
                // Find the students and return their id
                let s = await User.findOne({uuid: (student as IUser).uuid})
                return s._id
            }))
            let savedTeam = await newTeamToSave.save() // Save the new/updated team
            newTeamIds.push(savedTeam._id) // Add to teams list
        }
        return newTeamIds // Return the new list of team ids
    }
    
    createForClassGroup = async (req, res) => {
        try{
            let classGroupUUID = req.params.classGroupUUID
            let teacher = await User.findOne({userId: req.userId, platform: req.platform})
            let classGroup = await ClassGroup.findOne({
                uuid: classGroupUUID, 
                ownedBy: {
                    $in: [ teacher._id ]
                }
            })
            let assignment
            if (req.body.uuid){
                assignment = await AssignmentGroup.findOne({uuid: req.body.uuid}).populate("studentTeams").exec()
            }
            if (!assignment){
                assignment = await new AssignmentGroup()
            }
            assignment.inClassGroup = classGroup._id
            assignment.studentTeams = await this.updateStudentTeams(assignment.studentTeams as IStudentTeam[], req.body.studentTeams, teacher, req.body.name)
            assignment.name = req.body.name
            assignment.description = req.body.description
            assignment.starred = req.body.starred
            let savedAssignment = await assignment.save()
            res.status(200).json({message: "Assignment successfuly created", uuid: savedAssignment.uuid})
        } catch (e) {
            res.status(500).send({message: "Unable to create assignment"})
        }
    }

    async delete(req, res){
        try{
            let assignmentUUID = req.params.uuid
            let teacher = await User.findOne({userId: req.userId, platform: req.platform})
            let classGroupsOwnedByLoggedInUser = await ClassGroup.find({
                ownedBy: {
                    $in: [ teacher._id ]
                }
            })
            let bybyGroup = await AssignmentGroup.findOne({
                uuid: assignmentUUID,
                inClassGroup: {
                    $in: classGroupsOwnedByLoggedInUser.map(cg => cg._id)
                }
            })
            if (!bybyGroup){
                res.status(404).send({message: "Assignment not found"})
                return  
            }
            await bybyGroup.deleteOne()
            res.status(200).send({message: "Assignment succesfully deleted."})
        } catch (e) {
            res.status(500).send({message: "An error occured when removing the assignment"})
        }
        
    }

    async favorite(req, res){
        try {
            let assignmentUUID = req.params.uuid
            let teacher = await User.findOne({userId: req.userId, platform: req.platform})
            let classGroupsOwnedByLoggedInUser = await ClassGroup.find({
                ownedBy: {
                    $in: [ teacher._id ]
                }
            })
            let groupToFavorite = await AssignmentGroup.findOne({
                uuid: assignmentUUID,
                inClassGroup: {
                    $in: classGroupsOwnedByLoggedInUser.map(cg => cg._id)
                }
            })
            groupToFavorite.starred = req.body.favorite
            await groupToFavorite.save()
            res.status(200).send({message: "Assignment succesfully favorited."})
        } catch (e) {
            res.status(500).send({message: "An error occured when removing the assignment"})
        }
        
    }

}

export { AssignmentGroupController }