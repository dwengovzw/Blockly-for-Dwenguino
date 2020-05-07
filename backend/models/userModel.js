import mongoose from 'mongoose';
// Setup schema
var userSchema = mongoose.Schema({
    username: String,
    id: String,
    password: String,
    date_of_birth: Date,
    gender: String,
    school: String
});
// Export Contact model
var Useritem = mongoose.model('authentication', userSchema);
/*module.exports.get = function (callback, limit) {
    Useritem.find(callback).limit(limit);
}*/

export default Useritem;