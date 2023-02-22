import { Document, Schema, model } from "mongoose"
import { ID } from "./modelutils.js"
import { IUser } from "./user.model.js"
import { IPortfolio } from "./portfolio.model.js"
import  v4 from "uuid/v4.js"

interface IStudentTeam {
    uuid?: string,
    name: string,
    students: ID[] | IUser[],
    portfolio: ID | IPortfolio
}
const StudentTeamFields: Record<keyof IStudentTeam, any> = {
    uuid: {
        type: String,
        required: true,
        default: v4
    },
    name: {
        type: String,
        required: true
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        }
    ],
    portfolio: {
        type: Schema.Types.ObjectId,
        ref: 'Portfolio'
    }
}
const StudentTeamSchema = new Schema<IStudentTeam>(StudentTeamFields)
const StudentTeam = model<IStudentTeam>('StudentTeam', StudentTeamSchema)

export {
    IStudentTeam,
    StudentTeam
}