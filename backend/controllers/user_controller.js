import Useritem from '../models/user_model.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let exports  = {};

exports.getUserInfo = function(req, res) {
    let mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/dwenguinoblockly';
    mongoose.connect(mongoDB, { useNewUrlParser: true });
    let db = mongoose.connection;

    db.collection('users').findOne({username: req.user.username})
    .then(function(doc){
        if(doc){
            res.send(doc);
            db.close();
        } else {
            res.sendStatus(404);
        }
    });
}

exports.updateUserInfo = function(req, res) {
    let mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/dwenguinoblockly';
    mongoose.connect(mongoDB, { useNewUrlParser: true });
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
                db.close();
            } else {
                res.sendStatus(200);
                db.close();
            }
        } 
    );
}

export default exports