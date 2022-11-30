import mongoose from "mongoose"
import util from "util"

class UserSchema extends mongoose.Schema{
    constructor(extraAttributes = {}){
        super(extraAttributes)
        // Add the base properties for each user = email, oauth token, and role;
        this.add({
            username: String,
            email: String,
            accessToken: String,
            idToken: String,
            password: String,
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