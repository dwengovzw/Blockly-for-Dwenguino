import mongoose from 'mongoose';
import db from "../config/db.config.js";
const Role = mongoose.model("Role", new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum: Object.values(db.ROLES),
    }
}));
export { Role };
//# sourceMappingURL=role.model.js.map