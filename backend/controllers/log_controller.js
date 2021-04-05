// Import contact model
//import FunctionalVectorGenerator from '../functional_generator/functional_vector_generator.js'
import Logitem from '../models/log_model.js';
import uuidv4 from 'uuid/v4.js';
import { EVENT_NAMES } from '../../Blockly-for-Dwenguino/DwenguinoIDE/js/src/logging/event_names.js';
import path from 'path';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { Worker, isMainThread, parentPort } from 'worker_threads';

let exports = {};

exports.newSessionId = function(req, res) {
    let id = uuidv4();
    console.debug(id);
    res.status(200).send(id);
};

exports.event = function(req, res) {  
  let logitem = new Logitem();

  logitem.user_id = req.user._id;
  logitem.session_id = req.body.sessionId;
  logitem.activity_id = req.body.activityId;
  logitem.timestamp = req.body.timestamp;
  logitem.event.name = req.body.event.name;
  logitem.event.data = req.body.event.data;

  if (!req.body.event.name){
    res.send("incorrect logging format");
    return
  }

  // Save the logitem to the database
  // If the event was a workspace change: 
  // Spawn a thread after saving the item to generate the functional vector
  // Disabled saving for testing purposes
  logitem.save()
  .then(item => {

    // If the event is a changedworkspace event, generate functional vector otherwise just save the event
    if (req.body.event.name == EVENT_NAMES.changedWorkspace){
      let id = item.id;
      // let promise = processEvent({data: req.body.event.data});
      // promise.then((resp) => {
      //   console.log("promise fulfilled");
      //   console.log(resp);
      //   Logitem.findOneAndUpdate({"_id": id }, 
      //     {$set: { "event.functional_vector": resp.value }}, 
      //     { useFindAndModify: false, runValidators: false }, 
      //     (err, numAffected) => {
      //         console.log("updated entry");
      //     }
      //   );
      // }).catch((err) => {
      //   console.error(err);  
      // }); 
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  })
  .catch(err => {
    console.debug(err);
    res.sendStatus(500);
  });
};

function processEvent(data){
  return new Promise((resolve, reject) => {
    let workerResult = null;
    // When running from debugger
    //const worker = new Worker('./backend/functional_generator/worker_startup.js', { workerData: data });
    // When running from start script
    const worker = new Worker('../backend/functional_generator/worker_startup.js', { workerData: data });
    // Get result value from worker
    worker.once("message", (value) => {
      workerResult = value.result;
    });
    // Resolve once thread has finished.
    worker.once( "exit", (exitCode) => {
      resolve({message: `Thread exited with code: ${exitCode}`, value: workerResult });
    });
    // Reject on error.
    worker.once("error", (err) => {
      reject(err);
    });
  })
}

exports.getTotalNumberOfLogItems = function(req, res) {
  let db = mongoose.connection;

  db.collection('loggings').countDocuments({})
  .then(function(count){
      res.status(200).send({ "totalLogItems": count });
  });
}

exports.getTotoalNumberOfRecentLogItems = function(req, res) {
  let db = mongoose.connection;

  let query = {
    timestamp: { // 5 minutes ago (from now)
        $gt: new Date(Date.now() - 1000 * 60 * 5)
    }
  }

  db.collection('loggings').countDocuments(query)
  .then(function(count){
    res.status(200).send({ "totalLogItems": count });
  });
}

exports.getRecentLogItems = function(req, res) {
  let db = mongoose.connection;
 
  let query = {
    timestamp: { // 5 minutes ago (from now)
        $gt: new Date(Date.now() - 1000 * 60 * 5)
    }
  }

  db.collection('loggings').find(query).toArray()
  .then(function(logItems){
    res.status(200).send(logItems);
  });
}

exports.getRecent100LogItems = function(req, res) {
  let db = mongoose.connection;

  db.collection('loggings').find({}, {sort: [['timestamp', -1]], limit: 100}).toArray()
  .then(function(logItems){

    res.status(200).send(logItems);
  });
}

exports.exportLogItems = function(req, res) {
  let db = mongoose.connection;

  db.collection('loggings').find({}, {}).toArray()
  .then(function(logItems){

    res.status(200).send(logItems);
  });
}

export default exports;