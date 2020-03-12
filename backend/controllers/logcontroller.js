// Import contact model
Logitem = require('../models/logModel');
const uuidv4 = require('uuid/v4');

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

    // save the contact and check for errors
    logitem.save()
      .then(item => {
        res.send("Logitem saved to database");
      })
      .catch(err => {
        console.debug(err);
        res.status(400).send("Unable to save to database");
      });
};

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