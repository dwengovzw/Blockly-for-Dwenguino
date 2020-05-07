import Useritem from '../models/userModel.js';
import bcrypt from 'bcrypt';

let exports = {};

exports.new = function(req, res) {
  let mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/dwenguinoblocklyexit', { useNewUrlParser: true });
  let db = mongoose.connection;
  const rounds = 10;

  db.collection('authentications').findOne({username: req.body.userId})
  .then(function(doc) {
      if(!doc){

        bcrypt.hash(req.body.password, rounds, (err, hashPassword) => {
          if (err) {
            res.status(401).send("Hashing has error.");
            db.close();
          } else {
            bcrypt.hash(req.body.userId, rounds, (err, hashUsername) => {
              if (err) {
                res.status(401).send("The username does already exist.");
                db.close();
              } else {
                  let user = new Useritem();
                  user.username = req.body.userId;
                  user.id = hashUsername;
                  user.password = hashPassword;
                  user.date_of_birth = null;
                  user.school = null;
                  user.gender = null;
                  user.save()
                  .then(item => {
                    res.send(user.id);
                    db.close();
                  })
                  .catch(err => {
                    res.status(400).send("Unable to register the new user into the database.");
                    db.close();
                  });
              }
            });
          }
        });
      } else {
        res.status(401).send("The username does already exist.");
        db.close();
      }
  });
};

exports.update = function(req, res) {
  let mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/dwenguinoblockly', { useNewUrlParser: true });
  let db = mongoose.connection;

  db.collection('authentications').findOne({username: req.body.userId})
  .then(function(doc) {
        if(!doc){
          res.status(401).send("The password was not correct or this username does not exist.");
          db.close();
        } else {
          bcrypt.compare(req.body.password, doc.password, (err, result) => {
            if (err) {
              res.status(401).send("The password was not correct or this username does not exist.");
              db.close();
            } else {
              if(result){
                let conditions = { username: req.body.userId };
                let update = { 
                  $set :
                  {
                    school: req.body.school,
                    date_of_birth: req.body.dateOfBirth,
                    gender: req.body.gender
                  }
                };
                let options = { multi: false};

                db.collection('authentications').update(conditions, update, options,
                  function(error, numAffected) {
                    res.send("Updating database successfull");
                    db.close();
                  } 
                );
              } else {
                res.status(401).send("The password was not correct or this username does not exist.");
                db.close();
              }
            }   
          });
        } 
  });
};

exports.authenticate = function(req, res) {
  let mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/dwenguinoblockly', { useNewUrlParser: true });
  let db = mongoose.connection;

  db.collection('authentications').findOne({username: req.body.userId})
  .then(function(doc) {
        if(!doc){
          res.status(401).send("The password was not correct or this username does not exist.");
          db.close();
        } else {
          bcrypt.compare(req.body.password, doc.password, (err, result) => {
            if (err) {
              res.status(401).send("The password was not correct or this username does not exist.");
              db.close();
            } else {
              if(result){
                let data = {
                  "id": doc.id
                }
                res.send(data);
                db.close();
              } else {
                res.status(401).send("The password was not correct.");
                db.close();
              }
            }   
          });
        } 
  });
};

export default exports;