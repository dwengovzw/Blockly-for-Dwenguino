import mongoose from 'mongoose';

var userSchema = mongoose.Schema({
    username: String,
    id: String,
    password: String,
    email: String,
    date_of_birth: Date,
    gender: String,
    school: String,
    language: String
});

var Useritem = mongoose.model('users', userSchema);


export default Useritem;