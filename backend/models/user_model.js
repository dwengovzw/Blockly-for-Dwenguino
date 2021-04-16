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
    acceptGeneralconditionsTimestamp: {
        type: Date,
        default: Date.now()
    },
    acceptResearchConditions: {
        type: Boolean,
        required: true
    },
    acceptResearchConditionsTimestamp: {
        type: Date,
        default: Date.now()
    }
});

var Useritem = mongoose.model('users', userSchema);


export default Useritem;