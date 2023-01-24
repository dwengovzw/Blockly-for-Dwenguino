import { Document, Schema, model } from "mongoose"
import { ID } from "./modelutils.js"
import { IUser } from "./user.model.js"
import { IPortfolio } from "./portfolio.model.js"

interface IStudentTeam {
    name: string,
    students: ID[] | IUser[],
    portfolio: ID | IPortfolio
}
const StudentTeamFields: Record<keyof IStudentTeam, any> = {
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