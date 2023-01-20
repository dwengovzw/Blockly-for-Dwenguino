import { Document, Schema, model } from "mongoose"
import { ID } from "./modelutils.js"
import { IStudentTeamDoc } from "./student_team.model.js"
import { IClassGroupDoc } from "./class_group.model.js"

interface IAssignmentGroup {
    name: string,
    description?: string,
    studentTeams: ID[] | IStudentTeamDoc[],
    inClassGroup: ID | IClassGroupDoc
}
interface IAssignmentGroupDoc extends IAssignmentGroup, Document {}
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
const AssignmentGroupSchema = new Schema(AssignmentGroupFields)
const AssignmentGroup = model<IAssignmentGroupDoc>('AssignmentGroup', AssignmentGroupSchema)

export  {
    IAssignmentGroup,
    IAssignmentGroupDoc,
    AssignmentGroup
}