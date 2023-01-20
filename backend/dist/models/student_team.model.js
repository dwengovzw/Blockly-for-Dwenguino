import { Schema, model } from "mongoose";
const StudentTeamFields = {
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
};
const StudentTeamSchema = new Schema(StudentTeamFields);
const StudentTeam = model('StudentTeam', StudentTeamSchema);
export { StudentTeam };
//# sourceMappingURL=student_team.model.js.map