import { Document, Schema, model } from "mongoose"
import { ID } from "./modelutils.js"
import { IStudent, ITeacher, IUser } from "./user.model.js"

interface IClassGroup {
    name: string,
    sharingCode?: string,
    description?: string,
    ownedBy: ID[] | ITeacher[],
    awaitingStudents: ID[] | IStudent[],
    students: ID[] | IStudent[]
}
const ClassGroupFields: Record<keyof IClassGroup, any> = {
    name: {
        type: String,
        required: true
    },
    sharingCode: {
        type: String,
        unique: true
    },
    description: String,
    ownedBy: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Teacher',
        }],
        required: true,
        default: [],
        validate: v => Array.isArray(v) && v.length > 0,
    },
    awaitingStudents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Student', 
            required: true, 
            default: []
        }
    ],
    students:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
            default: []
        }
    ]
}
const ClassGroupSchema = new Schema<IClassGroup>(ClassGroupFields)
const ClassGroup = model<IClassGroup>('ClassGroup', ClassGroupSchema)

export {
    IClassGroup,
    ClassGroup
}