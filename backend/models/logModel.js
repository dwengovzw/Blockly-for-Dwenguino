var mongoose = require('mongoose');
// Setup schema
var logSchema = mongoose.Schema({
    timestamp: {
        type: Date,
        required: true
    },
    session_id: String,
    agegroup: Number,
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
// Export Contact model
var Logitem = module.exports = mongoose.model('logging', logSchema);
module.exports.get = function (callback, limit) {
    Logitem.find(callback).limit(limit);
}