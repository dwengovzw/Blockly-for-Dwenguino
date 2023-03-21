import { Document, Schema, model } from "mongoose"
import { ID } from "./modelutils.js"
import { IUser, User } from "./user.model.js"
import { IPortfolio } from "./portfolio.model.js"
import  v4 from "uuid/v4.js"
import { PopulatedDoc } from 'mongoose';
import { Portfolio } from "./portfolio.model.js"

interface IStudentTeam {
    uuid?: string,
    students: PopulatedDoc<IUser>[],
    portfolio: PopulatedDoc<IPortfolio>
}
const StudentTeamFields: Record<keyof IStudentTeam, any> = {
    uuid: {
        type: String,
        required: true,
        default: v4
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    portfolio: {
        type: Schema.Types.ObjectId,
        ref: 'Portfolio'
    }
}
const StudentTeamSchema = new Schema<IStudentTeam>(StudentTeamFields)

/**
 * When a student team is deleted the corresponding portfolio is attached to each student in the team.
 * TODO: only do this when the portfolio has items, otherwise, remove.
 */
StudentTeamSchema.pre("deleteOne", {document:true, query: false}, async function(next) {
    try {
        let teamWithStudents = await this.populate<{students: IUser[], portfolio: IPortfolio}>("students portfolio")
        teamWithStudents.students.forEach(student => {
            student.portfolios.push(teamWithStudents.portfolio)
        })
        next()
    } catch (e) {
        console.log(e)
    }
    
})

const StudentTeam = model<IStudentTeam>('StudentTeam', StudentTeamSchema)





export {
    IStudentTeam,
    StudentTeam
}