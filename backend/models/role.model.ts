import mongoose from 'mongoose';
import db from "../config/db.config.js"



interface IRole{
    name: string
}
const RoleSchemaFields: Record<keyof IRole, any> = {
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum: Object.values(db.ROLES),
    }
}
const RoleSchema = new mongoose.Schema<IRole>(RoleSchemaFields)
const Role = mongoose.model<IRole>('Role', RoleSchema)


export { Role, IRole, RoleSchema };
