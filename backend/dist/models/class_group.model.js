import { Schema, model } from "mongoose";
const ClassGroupFields = {
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
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        }
    ]
};
const ClassGroupSchema = new Schema(ClassGroupFields);
const ClassGroup = model('ClassGroup', ClassGroupSchema);
export { ClassGroup };
//# sourceMappingURL=class_group.model.js.map