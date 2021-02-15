// Filename: api-routes.js
// Initialize express router
import express from 'express';
let router = express.Router();
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
// Import contact controller
import logcontroller from '../controllers/log_controller.js';
import utilscontroller from '../controllers/util_controller.js';
import schoolscontroller from '../controllers/school_controller.js';
import authenticationcontroller from '../controllers/authentication_controller.js';
import tutorialcontroller from '../controllers/tutorial_controller.js';
import usercontroller from '../controllers/user_controller.js';

router.route('/logging/id')
    .get(logcontroller.newSessionId);

router.route('/logging/event')
    .post(authenticationcontroller.authenticateForLogging,logcontroller.event);

router.route('/utilities/clean')
    .get(utilscontroller.clean);

router.route('/utilities/compile')
    .get(utilscontroller.compile);

router.route('/utilities/upload')
    .get(utilscontroller.upload);

router.route('/utilities/run', cors(corsOptions))
    .post(utilscontroller.run);

router.route('/schools/')
    .get(schoolscontroller.getSchools);

router.route('/register')
    .post(authenticationcontroller.register);

router.route('/login')
    .post(authenticationcontroller.login);

router.route('/renewToken')
    .post(authenticationcontroller.refreshToken);

router.route('/logout')
    .post(authenticationcontroller.logout);

router.route('/tutorials/completedTutorials')
    .get(authenticationcontroller.authenticate, tutorialcontroller.getCompletedTutorials);

router.route('/tutorials/completeTutorial')
    .post(authenticationcontroller.authenticate, tutorialcontroller.completeTutorial);

router.route('/user/')
    .get(authenticationcontroller.authenticate, usercontroller.getUserInfo);

router.route('/user/update')
    .post(authenticationcontroller.authenticate, usercontroller.updateUserInfo);


// Export API routes
export default router;