import { Schema, model } from "mongoose"
import { IStudentTeam, StudentTeam } from "./student_team.model"
import { IClassGroup } from "./class_group.model"
import  v4 from "uuid/v4"
import { PopulatedDoc } from 'mongoose';

interface IAssignmentGroup {
    uuid?: string,
    name: string,
    description?: string,
    starred?: boolean,
    studentTeams: PopulatedDoc<IStudentTeam>[],
    inClassGroup: PopulatedDoc<IClassGroup>
}
const AssignmentGroupFields: Record<keyof IAssignmentGroup, any> = {
    uuid: {
        type: String,
        required: true,
        default: v4
    },
    name: {
        type: String,
        required: true
    },
    description: String,
    starred: {
        type: Boolean,
        default: false
    },
    studentTeams: [
        {
            type: Schema.Types.ObjectId,
            ref: 'StudentTeam'
        }
    ],
    inClassGroup: {
        type: Schema.Types.ObjectId,
        ref: 'ClassGroup'
    }
}
const AssignmentGroupSchema = new Schema<IAssignmentGroup>(AssignmentGroupFields)

/**
 * Recursively delete the student teams in this assignment group
 */
AssignmentGroupSchema.pre('deleteOne', {document:true, query: false}, async function(next) {
    try{
        this.studentTeams.forEach(async element => {
            let bybyTeam = await StudentTeam.findOne({_id: element})
            if (bybyTeam) await bybyTeam.deleteOne()
        })
    } catch (e) {
        console.log(e)
    }
})

const AssignmentGroup = model<IAssignmentGroup>('AssignmentGroup', AssignmentGroupSchema)




export  {
    IAssignmentGroup,
    AssignmentGroup
}