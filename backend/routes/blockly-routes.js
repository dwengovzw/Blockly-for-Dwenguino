// Filename: api-routes.js
// Initialize express router
import express from 'express';
import querystring from "querystring"
let router = express.Router();

//xml parser
import parser from "fast-xml-parser"
//let router = require('express').Router();

//Configure cors middleware for the run route to allow all requests
import cors from 'cors';
//let cors = require('cors');

//app.use(cors());
let corsOptions = {
    origin: "*",
};

// // Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'The system is working!',
        message: 'To the moon and back.'
    });
});

let processStartBlocks = (startblock_xml, res, view="index.ejs") => {
    let blocks_xml = querystring.unescape(startblock_xml);
    if (!blocks_xml){
        blocks_xml = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="setup_loop_structure"></block></xml>'
    }

    blocks_xml = blocks_xml.trim()  // remove whitespace
    //let striptagregex = /^<xml xmlns="https:\/\/developers.google.com\/blockly\/xml">(.*)<\/xml>$/
    //let blocks_xml_stripped = blocks_xml.match(striptagregex)[1]
    res.render(view, {blocks_xml: blocks_xml, base_url: process.env.SERVER_URL, form_target: process.env.SERVER_URL + "simulator"});
}

let handleSimulatorRequest = (blocks_xml, res, view="index.ejs") => {
    if (blocks_xml && blocks_xml !== ""){
        processStartBlocks(blocks_xml, res, view);
    }else{
        let empty_program_xml = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="setup_loop_structure"></block></xml>';
        res.render(view, {blocks_xml: empty_program_xml, base_url: process.env.SERVER_URL, form_target: process.env.SERVER_URL + "simulator"});
    }
}

// load the application
router.get("/simulator", function(req, res) {
    let blocks_xml = req.query.xml;
    handleSimulatorRequest(blocks_xml, res);
})

// load the application with a program from xml
router.post("/simulator", function(req, res) {
    let blocks_xml = req.body.xml;
    handleSimulatorRequest(blocks_xml, res);
})

// load the application
router.get("/", function(req, res) {
    let blocks_xml = req.query.xml;
    handleSimulatorRequest(blocks_xml, res);
})

// load the application with a program from xml
router.post("/", function(req, res) {
    let blocks_xml = req.body.xml;
    handleSimulatorRequest(blocks_xml, res);
})


// load the application
router.get("/readonly", function(req, res) {
    let blocks_xml = req.query.xml;
    handleSimulatorRequest(blocks_xml, res, "readonly.ejs");
})

// load the application with a program from xml
router.post("/readonly", function(req, res) {
    let blocks_xml = req.body.xml;
    handleSimulatorRequest(blocks_xml, res, "readonly.ejs");
})


// Import contact controller
import logcontroller from '../controllers/log_controller.js';
import utilscontroller from '../controllers/util_controller.js';
import schoolscontroller from '../controllers/school_controller.js';
import authenticationcontroller from '../controllers/authentication_controller.js';
import tutorialcontroller from '../controllers/tutorial_controller.js';
import usercontroller from '../controllers/user_controller.js';
import programcontroller from '../controllers/program_controller.js';

router.route('/lang')
    .post(utilscontroller.setLanguage);

// lti routes
// Get and post are sent to the same controller action.
router.route("/initiate_login").get((req, res) => {
    req["data"] = req.query
    ltiController.initiate_login(req, res);
});
router.route("/initiate_login").post((req, res) => {
    req["data"] = req.body
    ltiController.initiate_login(req, res);
});

router.route("/authorize").post((req, res) => {
    ltiController.authorize(req, res)
})

/* Data collection */

router.route('/logging/newSessionId')
    .get(logcontroller.newSessionId);

router.route('/logging/event')
    .post(authenticationcontroller.authenticateForLogging,logcontroller.event);

/* Dwenguino microcontroller */   

router.route('/utilities/clean')
    .get(utilscontroller.clean);

router.route('/utilities/compile')
    .get(utilscontroller.compile);

router.route('/utilities/upload')
    .get(utilscontroller.upload);

router.route('/utilities/run', cors(corsOptions))
    .post(utilscontroller.run);


// Handle get and post of compilation in the same way
router.route('/utilities/getDwenguinoBinary')
    .get((req, res) => {
        req["data"] = req.query
        utilscontroller.getDwenguinoBinary(req, res)
    })

router.route('/utilities/getDwenguinoBinary')
    .post((req, res) => {
        req["data"] = req.body
        utilscontroller.getDwenguinoBinary(req, res)
    })

router.route('/utilities/getEnvironment', cors(corsOptions))
    .get(utilscontroller.getEnvironment)

/* Helper routes */

router.route('/schools/')
    .get(schoolscontroller.getSchools);

/* Authentication */

router.route('/register')
    .post(authenticationcontroller.register);

router.route('/login')
    .post(authenticationcontroller.login);

router.route('/resendActivationLink')
    .post(authenticationcontroller.resendActivationLink);

router.route('/auth/verify-account/:userId/:secretCode')
    .get(authenticationcontroller.verifyAccount);

router.route('/auth/renew')
    .post(authenticationcontroller.refreshToken);

router.route('/getPasswordResetCode')
    .post(authenticationcontroller.getPasswordResetCode);

router.route('/resetPassword')
    .post(authenticationcontroller.resetPassword);

router.route('/logout')
    .post(authenticationcontroller.logout);

/* Tutorials */

router.route('/tutorials/completedTutorials')
    .post(authenticationcontroller.authenticate, tutorialcontroller.getCompletedTutorials);

router.route('/tutorials/completeTutorial')
    .post(authenticationcontroller.authenticate, tutorialcontroller.completeTutorial);

/* User */

router.route('/user/')
    .get(authenticationcontroller.authenticate, usercontroller.getUserInfo);

router.route('/user/update')
    .post(authenticationcontroller.authenticate, usercontroller.updateUserInfo);

router.route('/user/delete')
    .get(authenticationcontroller.authenticate, usercontroller.deleteMyAccount);

router.route('/user/programs')
    .get(authenticationcontroller.authenticate, programcontroller.getUserPrograms);

router.route('/user/saveProgram')
    .post(authenticationcontroller.authenticate, programcontroller.saveUserProgram);

router.route('/user/deleteProgram')
    .post(authenticationcontroller.authenticate, programcontroller.deleteUserProgram);

router.route('/user/updateProgramName')
    .post(authenticationcontroller.authenticate, programcontroller.updateProgramName);

/* Admin */

router.route('/user/admin/getLoggingData')
    .get(authenticationcontroller.authenticateAdmin, usercontroller.getLoggingDataOfOtherUser);

router.route('/user/admin/delete')
    .post(authenticationcontroller.authenticateAdmin, usercontroller.deleteAccountOfOtherUser);    

router.route('/user/admin/totalUsers')
    .get(authenticationcontroller.authenticateAdmin, usercontroller.getTotalNumberOfUsers);

router.route('/user/admin/totalVerifiedUsers')
    .get(authenticationcontroller.authenticateAdmin, usercontroller.getTotalNumberOfVerifiedUsers);

router.route('/user/admin/totalLogItems')
    .get(authenticationcontroller.authenticateAdmin, logcontroller.getTotalNumberOfLogItems);    

router.route('/user/admin/totalRecentLogItems')
    .get(authenticationcontroller.authenticateAdmin, logcontroller.getTotoalNumberOfRecentLogItems); 

router.route('/user/admin/getRecentLogItems')
    .get(authenticationcontroller.authenticateAdmin, logcontroller.getRecentLogItems); 

router.route('/user/admin/getRecent100LogItems')
    .get(authenticationcontroller.authenticateAdmin, logcontroller.getRecent100LogItems); 

router.route('/user/admin/exportLogItems')
    .post(authenticationcontroller.authenticateAdmin, logcontroller.exportLogItems); 

// Export API routes
export default router;