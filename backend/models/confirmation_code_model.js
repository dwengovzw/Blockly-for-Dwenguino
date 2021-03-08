import mongoose from 'mongoose';

var confirmationCodeSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now(), 
        expires: 600 
    }
});

var ConfirmationCodeItem = mongoose.model('confirmation_codes', confirmationCodeSchema);


export default ConfirmationCodeItem;