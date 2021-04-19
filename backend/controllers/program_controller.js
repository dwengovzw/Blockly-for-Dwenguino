import ProgramItem from '../models/program_model.js';
import mongoose from 'mongoose';

let exports  = {};

/**
 * Returns all saved programs from the authenticated user.
 * @param {*} req 
 * @param {*} res 
 */
exports.getUserPrograms = function(req, res) {
  let db = mongoose.connection;

  var query = ProgramItem.find({});
  query.where('user_id',   mongoose.Types.ObjectId(req.user._id));
  query.exec(function (err, docs) {
    res.send(docs);
  });
}

/**
 * Saves a program from the authenticated user into the database.
 * A user id, program name and program code should be provided. We also 
 * record the timestamp of when the program was saved.
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Delete the program from the authenticated user with the specified program id.
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Update the program name of the program previously saved by the authenticated user and 
 * identified by the specified program_id.
 * @param {*} req 
 * @param {*} res 
 */
exports.updateProgramName = function(req, res) {
  let db = mongoose.connection;
  let user_id = req.user._id;
  let program_id = mongoose.Types.ObjectId(req.body._id);

  let conditions = { _id: program_id, user_id: user_id };
  let update = { 
      $set :
      {
          program_name: req.body.program_name
      }
  };
  let options = { multi: false};

  db.collection('programs').updateOne(conditions, update, options,
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