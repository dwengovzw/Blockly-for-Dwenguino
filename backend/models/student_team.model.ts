import { Document, Schema, model } from "mongoose"
import { ID } from "./modelutils.js"
import { IUserDoc } from "./users.model.js"
import { IPortfolioDoc } from "./portfolio.model.js"

interface IStudentTeam {
    name: string,
    students: ID[] | IUserDoc[],
    portfolio: ID | IPortfolioDoc
}
interface IStudentTeamDoc extends IStudentTeam, Document {}
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
const StudentTeamSchema = new Schema(StudentTeamFields)
const StudentTeam = model<IStudentTeamDoc>('StudentTeam', StudentTeamSchema)

export {
    IStudentTeam,
    IStudentTeamDoc,
    StudentTeam
}