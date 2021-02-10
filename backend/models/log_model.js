import mongoose from 'mongoose';
// Setup schema
var logSchema = mongoose.Schema({
    timestamp: {
        type: Date,
        required: true
    },
    user_id: String,
    session_id: String,
    activity_id: Number,
    event: {
        name: {
            type: String,
            required: true
        }, 
        data: String,
        functional_vector: Array,
    }
});

var Logitem = mongoose.model('logging', logSchema);
let get = function (callback, limit) {
    Logitem.find(callback).limit(limit);
}


export default Logitem;