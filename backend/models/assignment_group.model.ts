import { Document, Schema, model } from "mongoose"
import { ID } from "./modelutils.js"
import { IStudentTeam } from "./student_team.model.js"
import { IClassGroup } from "./class_group.model.js"

interface IAssignmentGroup {
    name: string,
    description?: string,
    studentTeams: ID[] | IStudentTeam[],
    inClassGroup: ID | IClassGroup
}
const AssignmentGroupFields: Record<keyof IAssignmentGroup, any> = {
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