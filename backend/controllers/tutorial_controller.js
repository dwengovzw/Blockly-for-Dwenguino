import Useritem from '../models/user_model.js';
import Tutorialitem from '../models/tutorial_model.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let exports  = {};

exports.getCompletedTutorials = function(req, res) {
  let db = mongoose.connection;

  var query = Tutorialitem.find({});
  query.where('user_id',   mongoose.Types.ObjectId(req.user._id));
  query.where('category', req.body.category);
  query.select('tutorial_id');
  query.exec(function (err, docs) {
    res.send(docs);
  });
}


exports.completeTutorial = function(req, res) {
  let db = mongoose.connection;

  let completedTutorial = new Tutorialitem();
  completedTutorial.user_id = mongoose.Types.ObjectId(req.user._id);
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

export default exports