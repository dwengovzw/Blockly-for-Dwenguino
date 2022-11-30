import mongoose from 'mongoose';

const Role = mongoose.model(
    "Role",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            enum: ["student", "teacher", "admin", "subscriber"],
        }
    })
)

export default Role;