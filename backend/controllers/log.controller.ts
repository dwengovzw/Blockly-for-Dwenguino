// Import contact model
import Logitem from '../models/log_model.js';
import uuidv4 from 'uuid/v4.js';
import { EVENT_NAMES } from '../utils/event_names.js';
import mongoose from 'mongoose';
import Validator from '../utils/validator.js';

import { Worker, isMainThread, parentPort } from 'worker_threads';

let exports = {};

let newSessionId = function(req, res) {
    let id = uuidv4();
    console.debug(id);
    res.status(200).send(id);
};

let event = function(req, res) {  
  let logitem = new Logitem();

  const { 
    timestamp,
    sessionId,
    activityId,
    eventName,
    data
  } = req.body;

  let errors = Validator.validateLoggingFields(timestamp, eventName);
  if (errors.length > 0) {
    res.status(401).send(errors);
  } else {
    if (req.user){
      logitem.userId = req.user._id;
    } else {
      logitem.userId = "anonymous"
    }
    
    logitem.sessionId = sessionId;
    logitem.activityId = activityId;
    logitem.timestamp = timestamp;
    logitem.eventName = eventName;
    logitem.data = data;

    // Save the logitem to the database
    // If the event was a workspace change: 
    // Spawn a thread after saving the item to generate the functional vector
    logitem.save()
    .then(item => {
      // If the event is a changedworkspace event, generate functional vector otherwise just save the event
      if (req.body.eventName == EVENT_NAMES.changedWorkspace){
        let id = item._id;
        res.sendStatus(200);
      } else {
        res.sendStatus(200);
      }
    })
    .catch(err => {
      console.debug(err);
      res.status(500).send(`Error when saving files: ${err}`);
    });
  }
};


/**
 * Counts the number of logged events.
 * @param {*} req 
 * @param {*} res 
 */
let getTotalNumberOfLogItems = function(req, res) {
  let db = mongoose.connection;

  db.collection('loggings').countDocuments({})
  .then(function(count){
      res.status(200).send({ "totalLogItems": count });
  });
}

/**
 * Counts the number of logged events from the past 5 minutes.
 * @param {*} req 
 * @param {*} res 
 */
let getTotoalNumberOfRecentLogItems = function(req, res) {
  let db = mongoose.connection;

  let query = {
    timestamp: {
        $gt: new Date(Date.now() - 1000 * 60 * 5)
    }
  }

  db.collection('loggings').countDocuments(query)
  .then(function(count){
    res.status(200).send({ "totalLogItems": count });
  });
}

/**
 * Returns the collection of logged events from the past 5 minutes.
 * @param {*} req 
 * @param {*} res 
 */
let getRecentLogItems = function(req, res) {
  let db = mongoose.connection;
 
  let query = {
    timestamp: { 
        $gt: new Date(Date.now() - 1000 * 60 * 5)
    }
  }

  db.collection('loggings').find(query).toArray()
  .then(function(logItems){
    res.status(200).send(logItems);
  });
}

/**
 * Returns the collection of the 100 most recent logged events.
 * @param {*} req 
 * @param {*} res 
 */
let getRecent100LogItems = function(req, res) {
  let db = mongoose.connection;

  db.collection('loggings').find({}, {sort: [['timestamp', -1]], limit: 100}).toArray()
  .then(function(logItems){

    res.status(200).send(logItems);
  });
}

/**
 * Returns a collection of logged events. A Date range (dateFrom en dateUntil) can be specified 
 * to restrict the collection of events to a specific period. 
 * If no range is provided, then it returns the collection of all logged events.
 * @param {*} req 
 * @param {*} res 
 */
let exportLogItems = function(req, res) {
  let db = mongoose.connection;

  const { dateFrom, dateUntil } = req.body;

  let query = {};
  if((dateFrom != null) && (dateUntil != null)) {
    query = {
      timestamp: { 
          $gt: new Date(dateFrom),
          $lt: new Date(dateUntil)
      }
    }
  } else if(dateFrom != null){
    query = {
      timestamp: { 
          $gt: new Date(dateFrom),
      }
    }
  } else if(dateUntil != null){
    query = {
      timestamp: { 
          $lt: new Date(dateUntil)
      }
    }
  }
  
  db.collection('loggings').find(query, {}).toArray()
  .then(function(logItems){

    res.status(200).send(logItems);
  });
}

export { newSessionId, getTotalNumberOfLogItems, getTotoalNumberOfRecentLogItems, getRecentLogItems, getRecent100LogItems, exportLogItems };