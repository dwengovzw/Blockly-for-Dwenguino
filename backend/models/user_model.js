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
    language: {
        type: String,
        default: "en"
    }
    // username: String,
    // id: String,
    // password: String,
    // email: String,
    // date_of_birth: Date,
    // gender: String,
    // school: String,
    // language: String,

});

var Useritem = mongoose.model('users', userSchema);


export default Useritem;