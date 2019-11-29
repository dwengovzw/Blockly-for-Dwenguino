// contactModel.js
var mongoose = require('mongoose');
// Setup schema
var contactSchema = mongoose.Schema({
    timestamp: {
        type: Date,
        required: true
    },
    session_id: Number,
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
var Contact = module.exports = mongoose.model('contact', contactSchema);
module.exports.get = function (callback, limit) {
    Contact.find(callback).limit(limit);
}