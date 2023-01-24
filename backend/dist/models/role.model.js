import mongoose from 'mongoose';
import db from "../config/db.config.js";
const RoleSchemaFields = {
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum: Object.values(db.ROLES),
    }
};
const RoleSchema = new mongoose.Schema(RoleSchemaFields);
const Role = mongoose.model('Role', RoleSchema);
export { Role, RoleSchema };
//# sourceMappingURL=role.model.js.map