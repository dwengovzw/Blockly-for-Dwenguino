Useritem = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.new = function(req, res) {
  let mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/dwenguinoblockly', { useNewUrlParser: true });
  let db = mongoose.connection;
  const rounds = 10;

  db.collection('authentications').findOne({user_id: req.body.userId})
  .then(function(doc) {
      if(!doc){

        bcrypt.hash(req.body.password, rounds, (err, hash) => {
          if (err) {
            res.status(401).send("The username does already exist.");
            db.close();
          } else {
            let user = new Useritem();
            user.user_id = req.body.userId;
            user.password = hash;
            user.save()
            .then(item => {
              res.send("New user is registered.");
              db.close();
            })
            .catch(err => {
              res.status(400).send("Unable to register the new user into the database.");
              db.close();
            });
          }
          
        });
      } else {
        res.status(401).send("The username does already exist.");
        db.close();
      }
  });
};

exports.authenticate = function(req, res) {
  let mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/dwenguinoblockly', { useNewUrlParser: true });
  let db = mongoose.connection;

  db.collection('authentications').findOne({user_id: req.body.userId})
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
                res.send("Successfully authenticated");
                db.close();
              } else {
                res.status(401).send("The password was not correct or this username does not exist.");
                db.close();
              }
            }   
          });
        } 
  });
};
