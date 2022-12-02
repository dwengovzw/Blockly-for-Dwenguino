import mongoose from "mongoose"
import db from "../config/db.config.js"

class UserSchema extends mongoose.Schema{
    constructor(extraAttributes = {}){
        super(extraAttributes)
        // Add the base properties for each user = email, oauth token, and role;
        this.add({
            userId:{
                type: String,
                required: true,
            },
            platform: {
                type: String,
                required: true,
                enum: Object.values(db.PLATFORMS)
            },
            name: String,
            email: String,
            roles: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Role"
                }
            ]
        })
    }
}

const userSchema = new UserSchema();
// Enforce userId and platform combination to be unique
userSchema.index({ userId: 1, platform: 1 }, { unique: true });


const studentSchema = new UserSchema({
    schoolId: String,
    grade: String,
    environmentState: String, // TODO: update this to a more fitting data type
    birthdate: Date,
    // TODO: see what info we can get from leerID
});
const teacherSchema = new UserSchema({
    schoolId: String,
    // TODO: see what extra info we can get from teacher db
})

const User = mongoose.model("User", userSchema)
const Student = User.discriminator("Student", studentSchema);
const Teacher = User.discriminator("Teacher", teacherSchema);




export { User, Student, Teacher }