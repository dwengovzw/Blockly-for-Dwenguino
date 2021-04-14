import mongoose from 'mongoose';

var userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "student"
    },
    status: {
        type: String,
        default: "pending"
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    acceptGeneralConditions: {
        type: Boolean,
        required: true
    }, 
    acceptResearchConditions: {
        type: Boolean,
        required: true
    }
});

var Useritem = mongoose.model('users', userSchema);


export default Useritem;