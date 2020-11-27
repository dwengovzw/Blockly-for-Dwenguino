// Import contact model
//import FunctionalVectorGenerator from '../functional_generator/functional_vector_generator.js'
import Logitem from '../models/log_model.js';
import uuidv4 from 'uuid/v4.js';
import { EVENT_NAMES } from '../../Blockly-for-Dwenguino/DwenguinoIDE/js/src/logging/event_names.js';
import path from 'path'

import { Worker, isMainThread, parentPort } from 'worker_threads';

let exports = {};

exports.newSessionId = function(req, res) {
    let id = uuidv4();
    res.send(id);
};

exports.event = function(req, res) {  
    let logitem = new Logitem();
   
    logitem.user_id = req.body.userId;
    logitem.school = req.body.school;
    logitem.session_id = req.body.sessionId;
    logitem.date_of_birth = req.body.dateOfBirth;
    logitem.gender = req.body.gender;
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
    logitem.save();
    // Disabled functional data generation (to much resource use on server)
    /*
      .then(item => {
        // If the event is a changedworkspace event, generate functional vector otherwise just save the event
        if (req.body.event.name == EVENT_NAMES.changedWorkspace){
          let id = item.id;
          let promise = processEvent({data: req.body.event.data});
          promise.then((resp) => {
            console.log("promise fulfilled");
            console.log(resp);
            Logitem.findOneAndUpdate({"_id": id }, 
              {$set: { "event.functional_vector": resp.value }}, 
              { useFindAndModify: false, runValidators: false }, 
              (err, numAffected) => {
                  console.log("updated entry");
              }
            );
          }).catch((err) => {
            console.error(err);
          }); 
        }
      })
      .catch(err => {
        console.debug(err);
      });*/

    // This does not let the client know if the server was able to save the item or not.
    // Tis is not required i think since it doesn't realy matter if logging events get lost
    res.send("Logitem received by server");
    
};

function processEvent(data){
  return new Promise((resolve, reject) => {
    let workerResult = null;
    // When running from debugger
    const worker = new Worker('./backend/functionalGenerator/workerStartup.js', { workerData: data });
    // When running from start script
    //const worker = new Worker('../functionalGenerator/workerStartup.js', { workerData: data });
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

// Handle index actions
// exports.index = function (req, res) {
//     Contact.get(function (err, contacts) {
//         if (err) {
//             res.json({
//                 status: "error",
//                 message: err,
//             });
//         }
//         res.json({
//             status: "success",
//             message: "Contacts retrieved successfully",
//             data: contacts
//         });
//     });
// };

// // Handle create contact actions
// exports.new = function (req, res) {
//     var contact = new Contact();
//     contact.name = req.body.name ? req.body.name : contact.name;
//     contact.gender = req.body.gender;
//     contact.email = req.body.email;
//     contact.phone = req.body.phone;
// // save the contact and check for errors
//     contact.save(function (err) {
//         // if (err)
//         //     res.json(err);
// res.json({
//             message: 'New contact created!',
//             data: contact
//         });
//     });
// };
// // Handle view contact info
// exports.view = function (req, res) {
//     Contact.findById(req.params.contact_id, function (err, contact) {
//         if (err)
//             res.send(err);
//         res.json({
//             message: 'Contact details loading..',
//             data: contact
//         });
//     });
// };
// // Handle update contact info
// exports.update = function (req, res) {
// Contact.findById(req.params.contact_id, function (err, contact) {
//         if (err)
//             res.send(err);
// contact.name = req.body.name ? req.body.name : contact.name;
//         contact.gender = req.body.gender;
//         contact.email = req.body.email;
//         contact.phone = req.body.phone;
// // save the contact and check for errors
//         contact.save(function (err) {
//             if (err)
//                 res.json(err);
//             res.json({
//                 message: 'Contact Info updated',
//                 data: contact
//             });
//         });
//     });
// };
// // Handle delete contact
// exports.delete = function (req, res) {
//     Contact.remove({
//         _id: req.params.contact_id
//     }, function (err, contact) {
//         if (err)
//             res.send(err);
// res.json({
//             status: "success",
//             message: 'Contact deleted'
//         });
//     });
// };

export default exports;