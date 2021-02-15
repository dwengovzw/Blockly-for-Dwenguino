import Useritem from '../models/user_model.js';
import Tutorialitem from '../models/tutorial_model.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let exports  = {};

exports.getCompletedTutorials = function(req, res) {
  let db = mongoose.connection;

  var query = Tutorialitem.find({});
  query.where('user_id', req.user.username);
  query.where('category', req.body.category);
  query.select('tutorial_id');
  query.exec(function (err, docs) {
    res.send(docs);
  });
}


exports.completeTutorial = function(req, res) {
  let db = mongoose.connection;

  let completedTutorial = new Tutorialitem();
  completedTutorial.user_id = req.user.username;
  completedTutorial.tutorial_id = req.body.tutorialId;
  completedTutorial.category = req.body.category;

  // save the contact and check for errors
  completedTutorial.save()
    .then(item => {
      res.send("Tutorialitem saved to database");
    })
    .catch(err => {
      console.debug(err);
      res.status(400).send("Unable to save to database");
    });
}

exports.newCompletedTutorial = function(req, res) {  
  let db = mongoose.connection;

  db.collection('authentications').findOne({username: req.body.username})
  .then(function(doc) {
        if(!doc){
          res.status(401).send("The password was not correct or this username does not exist.");
        } else {
          bcrypt.compare(req.body.password, doc.password, (err, result) => {
            if (err) {
              res.status(401).send("The password was not correct or this username does not exist.");
            } else {
              if(result){
                let completedTutorial = new Tutorialitem();
              
                completedTutorial.user_id = doc.id;
                completedTutorial.tutorial_id = req.body.tutorialId;
                completedTutorial.category = req.body.category;

                // save the contact and check for errors
                completedTutorial.save()
                  .then(item => {
                    res.send("Tutorialitem saved to database");
                  })
                  .catch(err => {
                    console.debug(err);
                    res.status(400).send("Unable to save to database");
                  });
              } else {
                  res.status(401).send("The password was not correct.");
              }
            }   
          });
        } 
    });
};

export default exports