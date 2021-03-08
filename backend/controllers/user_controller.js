import Useritem from '../models/user_model.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let exports  = {};

exports.getUserInfo = function(req, res) {
    let db = mongoose.connection;

    let id = mongoose.Types.ObjectId(req.user._id);
    db.collection('users').findOne({_id: id})
    .then(function(user){
        if(user){
            res.send(user);
        } else {
            res.sendStatus(404);
        }
    });
}

exports.updateUserInfo = function(req, res) {
    let db = mongoose.connection;

    let id = mongoose.Types.ObjectId(req.user._id);
    let conditions = { _id: id };
    let update = { 
        $set :
        {
            language: req.body.language
        }
    };
    let options = { multi: false};

    db.collection('users').updateOne(conditions, update, options,
        function(error, numAffected) {
            if(error){
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(200);
            }
        } 
    );
}

exports.deleteAccount = function(req, res) {
    let db = mongoose.connection;
    let id = mongoose.Types.ObjectId(req.user._id)
    let conditions = {_id: id };
    db.collection('users').deleteOne(conditions, function(error, numAffected) {
        if (error){
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
}

export default exports