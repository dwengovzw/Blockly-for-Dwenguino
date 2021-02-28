import mongoose from 'mongoose';

var refreshTokenSchema = mongoose.Schema({
    token: String,
    email: String
});

var RefreshTokenItem = mongoose.model('tokens', refreshTokenSchema);


export default RefreshTokenItem;