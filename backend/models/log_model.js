import mongoose from 'mongoose';
// Setup schema
var logSchema = mongoose.Schema({
    timestamp: {
        type: Date,
        required: true
    },
    user_id: {
        type: String,
        required: false
    },
    session_id: {
        type: String,
        required: false
    },
    activity_id: {
        type: Number,
        required: false
    },
    event: {
        name: {
            type: String,
            required: true
        }, 
        data: {
            type: String,
            required: false
        },
        functional_vector: {
            type: Array,
            required: false
        }
    }
});

var Logitem = mongoose.model('loggings', logSchema);
let get = function (callback, limit) {
    Logitem.find(callback).limit(limit);
}


export default Logitem;