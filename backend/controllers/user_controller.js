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
            let userInfo = {
                firstname: user.firstname,
                email: user.email,
                role: user.role,
            };
            res.send(userInfo);
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

exports.deleteMyAccount = function(req, res) {
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

exports.deleteAccountOfOtherUser = function(req, res){
    let db = mongoose.connection;
    let email = mongoose.Types.ObjectId(req.email)
    let conditions = {email: email};
    db.collection('users').deleteOne(conditions, function(error, numAffected){
        if (error){
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
}

exports.getLoggingDataOfOtherUser = function(req, res) {
    let db = mongoose.connection;

    let email = mongoose.Types.ObjectId(req.email);
    db.collection('users').findOne({email: email})
    .then(function(user){
        let conditions = { user_id: user._id};
        db.collection('loggings').find(conditions, function(err, loggings){
            if(err){
                console.log(err);
                res.status(400).send(user);
            } else {
                let tutorialConditions = { user_id: user._id};
                db.collection('tutorials').find(tutorialConditions, function(errTutorials, tutorials){
                    if(errTutorials){
                        console.log(errTutorials);
                        res.status(400).send({ "user": user, "loggings": loggings });
                    } else {
                        res.status(200).send({ "user": user, "loggings": loggings, "tutorials": tutorials });
                    }
                });
            }
        });
    });
}

exports.getTotalNumberOfUsers = function(req, res) {
    let db = mongoose.connection;

    db.collection('users').countDocuments({})
    .then(function(count){
        res.status(200).send({ "totalUsers": count });
    });
}

exports.getTotalNumberOfVerifiedUsers = function(req, res) {
    let db = mongoose.connection;
    
    db.collection('users').countDocuments({status: "active"})
    .then(function(count){
        res.status(200).send({"totalVerifiedUsers": count});
    });
}

export default exports