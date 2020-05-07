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

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'The system is working!',
        message: 'To the moon and back.'
    });
});
// Import contact controller
import logcontroller from '../controllers/logcontroller.js';
import utilscontroller from '../controllers/utilscontroller.js';
import schoolscontroller from '../controllers/schoolscontroller.js';
import authenticationcontroller from '../controllers/authenticationcontroller.js';
import tutorialcontroller from '../controllers/tutorialcontroller.js';

router.route('/logging/id')
    .get(logcontroller.newSessionId);

router.route('/logging/event')
    .post(logcontroller.event);

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

router.route('/authentication/new')
    .post(authenticationcontroller.new);

router.route('/authentication/authenticate')
    .post(authenticationcontroller.authenticate);

router.route('/authentication/updateUser')
    .post(authenticationcontroller.update);

router.route('/tutorials/completedTutorials')
    .post(tutorialcontroller.getCompletedTutorials);

router.route('/tutorials/completeTutorial')
    .post(tutorialcontroller.newCompletedTutorial);

// Export API routes
//module.exports = router;
export default router;