import { Document, Schema, model } from "mongoose"
import { ID } from "./modelutils.js"
import { IStudentTeam } from "./student_team.model.js"
import { IClassGroup } from "./class_group.model.js"
import  v4 from "uuid/v4.js"
import { PopulatedDoc } from 'mongoose';

interface IAssignmentGroup {
    uuid?: string,
    name: string,
    description?: string,
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
const AssignmentGroup = model<IAssignmentGroup>('AssignmentGroup', AssignmentGroupSchema)

export  {
    IAssignmentGroup,
    AssignmentGroup
}