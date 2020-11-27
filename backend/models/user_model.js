import mongoose from 'mongoose';

var userSchema = mongoose.Schema({
    username: String,
    id: String,
    password: String,
    date_of_birth: Date,
    gender: String,
    school: String
});

var Useritem = mongoose.model('authentication', userSchema);


export default Useritem;