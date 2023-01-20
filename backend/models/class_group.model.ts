import { Document, Schema, model } from "mongoose"
import { ID } from "./modelutils.js"
import { IStudentDoc, ITeacherDoc, IUserDoc } from "./users.model.js"

interface IClassGroup {
    name: string,
    sharingCode?: string,
    description?: string,
    ownedBy: ID[] | ITeacherDoc[],
    awaitingStudents: ID[] | IStudentDoc[],
    students: ID[] | IStudentDoc[]
}
interface IClassGroupDoc extends IClassGroup, Document {}
const ClassGroupFields: Record<keyof IClassGroup, any> = {
    name: {
        type: String,
        required: true
    },
    sharingCode: String,
    description: String,
    ownedBy: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Teacher',
        }],
        validate: v => Array.isArray(v) && v.length > 0,
    },
    awaitingStudents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        }
    ],
    students:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        }
    ]
}
const ClassGroupSchema = new Schema(ClassGroupFields)
const ClassGroup = model<IClassGroupDoc>('ClassGroup', ClassGroupSchema)

export {
    IClassGroup,
    IClassGroupDoc,
    ClassGroup
}