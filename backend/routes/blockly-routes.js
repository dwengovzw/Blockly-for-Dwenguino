// Filename: api-routes.js
// Initialize express router
let router = require('express').Router();

//Configure cors middleware for the run route to allow all requests
let cors = require('cors');

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
let logcontroller = require('../controllers/logcontroller');
let utilsconvroller = require('../controllers/utilscontroller');
let schoolscontroller = require('../controllers/schoolscontroller');
let authenticationcontroller = require('../controllers/authenticationcontroller');
let tutorialcontroller = require('../controllers/tutorialcontroller');

router.route('/logging/id')
    .get(logcontroller.newSessionId);

router.route('/logging/event')
    .post(logcontroller.event);

router.route('/utilities/clean')
    .get(utilsconvroller.clean);

router.route('/utilities/compile')
    .get(utilsconvroller.compile);

router.route('/utilities/upload')
    .get(utilsconvroller.upload);

router.route('/utilities/run', cors(corsOptions))
    .post(utilsconvroller.run);

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
module.exports = router;