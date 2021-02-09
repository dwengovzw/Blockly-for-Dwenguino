import mongoose from 'mongoose';

var refreshTokenSchema = mongoose.Schema({
    token: String,
    username: String
});

var RefreshTokenItem = mongoose.model('tokens', refreshTokenSchema);


export default RefreshTokenItem;