import mongoose from "mongoose"
import { v4 as uuidv4 } from 'uuid'
import Logger from "../logger.js"

const Schema = mongoose;

const nonceStoreSchema = new mongoose.Schema({
    user_id: {    
        type: String,
        required: true,
    },
    nonce: {    // Human readable unique id, can be any string chosen by the user -> generates error if chosen id exists. Should be different for each version of the same document.
        type: String,
        required: true,
        default: uuidv4, // Use automatically generated nonce
    },
    createdAt: { type: Date, expires: 20, default: Date.now()} // Automatically timestamped and removed after 20 seconds
});


const NonceStore = mongoose.model('nonceStore', nonceStoreSchema);

export default NonceStore