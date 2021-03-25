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

router.route('/lang')
    .post(utilscontroller.setLanguage);
    
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

/* Helper routes */

router.route('/schools/')
    .get(schoolscontroller.getSchools);

/* Authentication */

router.route('/register')
    .post(authenticationcontroller.register);

router.route('/login')
    .post(authenticationcontroller.login);

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
    .get(authenticationcontroller.authenticate, tutorialcontroller.getCompletedTutorials);

router.route('/tutorials/completeTutorial')
    .post(authenticationcontroller.authenticate, tutorialcontroller.completeTutorial);

/* User */

router.route('/user/')
    .get(authenticationcontroller.authenticate, usercontroller.getUserInfo);

router.route('/user/update')
    .post(authenticationcontroller.authenticate, usercontroller.updateUserInfo);

router.route('/user/delete')
    .post(authenticationcontroller.authenticate, usercontroller.deleteMyAccount);

router.route('/user/admin/getLoggingData')
    .post(authenticationcontroller.authenticateAdmin, usercontroller.getLoggingDataOfOtherUser);

router.route('/user/admin/delete')
    .post(authenticationcontroller.authenticateAdmin, usercontroller.deleteAccountOfOtherUser);    

// Export API routes
export default router;