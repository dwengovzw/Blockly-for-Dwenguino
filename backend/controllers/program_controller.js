import Useritem from '../models/user_model.js';
import ProgramItem from '../models/program_model.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let exports  = {};

exports.getUserPrograms = function(req, res) {
  let db = mongoose.connection;

  var query = ProgramItem.find({});
  query.where('user_id',   mongoose.Types.ObjectId(req.user._id));
  query.exec(function (err, docs) {
    res.send(docs);
  });
}

exports.saveUserProgram = function(req, res) {
    let db = mongoose.connection;
  
    let program = new ProgramItem();
    program.user_id = mongoose.Types.ObjectId(req.user._id);
    program.program_name = req.body.program_name;
    program.program = req.body.program;
    program.timestamp = Date.now();
  
    // save the contact and check for errors
    program.save()
      .then(item => {
        res.status(200).send("ProgramItem saved to database");
      })
      .catch(err => {
        console.debug(err);
        res.status(400).send("Unable to save to database");
      });
}

exports.deleteUserProgram = function(req, res) {
    let db = mongoose.connection;
    let user_id = req.user._id;
    let program_id = mongoose.Types.ObjectId(req.body._id);
    let conditions = {_id: program_id, user_id: user_id};

    db.collection('programs').deleteOne(conditions, function(error, numAffected){
        if (error){
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
}

export default exports