import mongoose from 'mongoose';
// Setup schema
var logSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: true
    },
    userId: {
        type: String,
        required: false
    },
    sessionId: {
        type: String,
        required: false
    },
    activityId: {
        type: Number,
        required: false
    },
    eventName: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: false
    },
    functionalVector: {
        type: Array,
        required: false
    }
    // event: {
    //     name: {
    //         type: String,
    //         required: true
    //     }, 
    //     data: {
    //         type: String,
    //         required: false
    //     },
    //     functional_vector: {
    //         type: Array,
    //         required: false
    //     }
    // }
});
var Logitem = mongoose.model('loggings', logSchema);
let get = function (callback, limit) {
    Logitem.find(callback).limit(limit);
};
export default Logitem;
//# sourceMappingURL=log_model.js.map