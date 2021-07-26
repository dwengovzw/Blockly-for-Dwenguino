import mongoose from 'mongoose';

var refreshTokenSchema = mongoose.Schema({
    token: String,
    email: String,
    dateCreated: {
        type: Date,
        default: Date.now(), 
        expires: 3 * 3600000
    }
});

var RefreshTokenItem = mongoose.model('tokens', refreshTokenSchema);


export default RefreshTokenItem;