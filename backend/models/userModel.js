var mongoose = require('mongoose');
// Setup schema
var userSchema = mongoose.Schema({
    user_id: String,
    password: String
});
// Export Contact model
var Useritem = module.exports = mongoose.model('authentication', userSchema);
module.exports.get = function (callback, limit) {
    Useritem.find(callback).limit(limit);
}