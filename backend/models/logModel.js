var mongoose = require('mongoose');
// Setup schema
var logSchema = mongoose.Schema({
    timestamp: {
        type: Date,
        required: true
    },
    user_id: String,
    school: String,
    session_id: String,
    date_of_birth: Date,
    gender: String,
    activity_id: Number,
    event: {
        name: {
            type: String,
            required: true
        }, 
        data: String,
    }
});

var Logitem = module.exports = mongoose.model('logging', logSchema);
module.exports.get = function (callback, limit) {
    Logitem.find(callback).limit(limit);
}