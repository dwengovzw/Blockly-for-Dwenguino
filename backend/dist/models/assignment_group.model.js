import { Schema, model } from "mongoose";
const AssignmentGroupFields = {
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
};
const AssignmentGroupSchema = new Schema(AssignmentGroupFields);
const AssignmentGroup = model('AssignmentGroup', AssignmentGroupSchema);
export { AssignmentGroup };
//# sourceMappingURL=assignment_group.model.js.map