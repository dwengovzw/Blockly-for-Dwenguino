import mongoose from 'mongoose';

let exports  = {};

/**
 * Returns the first name, email address and role of the authenticated user.
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Deletes the account of the authenticated user.
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteMyAccount = function(req, res) {
    let db = mongoose.connection;
    let id = mongoose.Types.ObjectId(req.user._id)
    let conditions = {_id: id };
    let conditionsPrograms = {user_id: id};
    db.collection('programs').deleteMany(conditionsPrograms, function(err){ 
        db.collection('users').deleteOne(conditions, function(error, numAffected) {
            if (error){
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(200);
            }
        });
    });
    
}

/**
 * Deletes the account of the user with the provided email address. 
 * Only accessible to admins.
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Returns the saved logged events from the user with the provided email address.
 * Only accessible to admins.
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Returns the total number of existing users (pending and active).
 * Only accessible to admins.
 * @param {*} req 
 * @param {*} res 
 */
exports.getTotalNumberOfUsers = function(req, res) {
    let db = mongoose.connection;

    db.collection('users').countDocuments({})
    .then(function(count){
        res.status(200).send({ "totalUsers": count });
    });
}

/**
 * Returns the total number of existing active users. 
 * Only accessible to admins.
 * @param {*} req 
 * @param {*} res 
 */
exports.getTotalNumberOfVerifiedUsers = function(req, res) {
    let db = mongoose.connection;
    
    db.collection('users').countDocuments({status: "active"})
    .then(function(count){
        res.status(200).send({"totalVerifiedUsers": count});
    });
}

export default exports