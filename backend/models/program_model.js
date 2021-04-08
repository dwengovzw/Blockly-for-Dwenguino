import mongoose from 'mongoose';
// Setup schema
var programSchema = mongoose.Schema({
    timestamp: {
        type: Date,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    program_name: {
        type: String,
        required: true
    },
    program: {
        type: String,
        required: true
    }
});

var ProgramItem = mongoose.model('programs', programSchema);
let get = function (callback, limit) {
    ProgramItem.find(callback).limit(limit);
}


export default ProgramItem;