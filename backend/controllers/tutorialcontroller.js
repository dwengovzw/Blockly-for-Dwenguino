Useritem = require('../models/userModel');
Tutorialitem = require('../models/tutorialModel');
const bcrypt = require('bcrypt');

exports.getCompletedTutorials = function(req, res) {
  let mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/dwenguinoblockly', { useNewUrlParser: true });
  let db = mongoose.connection;

  db.collection('authentications').findOne({username: req.body.username})
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
                var query = Tutorialitem.find({});

                query.where('user_id', doc.id);
                query.where('category', req.body.category);
                query.select('tutorial_id');
                query.exec(function (err, docs) {
                  res.send(docs);
                  db.close();
                });
              } else {
                res.status(401).send("The password was not correct.");
                db.close();
              }
            }   
          });
        } 
  });
};

