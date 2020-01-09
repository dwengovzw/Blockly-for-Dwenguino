var mongoose = require('mongoose');
// Setup schema
var tutorialSchema = mongoose.Schema({
    user_id: String,
    tutorial_id: String,
    category: String
});

var tutorials = module.exports = mongoose.model('tutorials', tutorialSchema);
module.exports.get = function (callback, limit) {
    tutorials.find(callback).limit(limit);
}