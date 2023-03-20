import { Document, Schema, model } from "mongoose"
import { ID } from "./modelutils.js"
import { IStudentTeam, StudentTeam } from "./student_team.model.js"
import { IClassGroup } from "./class_group.model.js"
import  v4 from "uuid/v4.js"
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
    this.studentTeams.forEach(async element => {
        let bybyTeam = await StudentTeam.findOne({_id: element})
        await bybyTeam.deleteOne()
    })
})

const AssignmentGroup = model<IAssignmentGroup>('AssignmentGroup', AssignmentGroupSchema)




export  {
    IAssignmentGroup,
    AssignmentGroup
}