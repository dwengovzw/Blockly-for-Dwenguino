import Useritem from '../models/user_model.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let exports  = {};

exports.getUserInfo = function(req, res) {
    let db = mongoose.connection;

    db.collection('users').findOne({username: req.user.username})
    .then(function(doc){
        if(doc){
            res.send(doc);
        } else {
            res.sendStatus(404);
        }
    });
}

exports.updateUserInfo = function(req, res) {
    let db = mongoose.connection;

    let conditions = { username: req.user.username };
    let update = { 
        $set :
        {
        school: req.body.school,
        date_of_birth: req.body.dateOfBirth,
        gender: req.body.gender
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

export default exports