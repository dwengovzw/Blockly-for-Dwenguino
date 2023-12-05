import { Schema, model, Types } from "mongoose"
import { IUser, User } from "./user.model"
import { IPortfolio } from "./portfolio.model"
import { v4 } from 'uuid';
import { PopulatedDoc } from 'mongoose';
import { Portfolio } from "./portfolio.model"

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
 */
StudentTeamSchema.pre("deleteOne", {document:true, query: false}, async function() {
    try {
        let teamWithStudents = await this.populate<{students: IUser[], portfolio: IPortfolio}>("students portfolio")
        if (teamWithStudents.portfolio.items.length > 0) { // If the portfolio has items, attach it to each student in the team
            teamWithStudents.students.forEach(student => {
                    student.portfolios.push(teamWithStudents.portfolio)
            })
        } else { // Otherwise, delete the portfolio
            Portfolio.deleteOne({uuid: teamWithStudents.portfolio.uuid})
        }
    } catch (e) {
        console.log(e)
    }
    
})

const StudentTeam = model<IStudentTeam>('StudentTeam', StudentTeamSchema)





export {
    IStudentTeam,
    StudentTeam
}