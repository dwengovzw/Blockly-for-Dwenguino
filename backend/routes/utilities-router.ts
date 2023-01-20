import express from 'express';
import UtilController from '../controllers/util.controller.js';
import cors from 'cors';

let utilitiesRouter = express.Router();

utilitiesRouter.route('/clean')
.get(UtilController.clean);

utilitiesRouter.route('/compile')
.get(UtilController.compile);

utilitiesRouter.route('/upload')
.get(UtilController.upload);

utilitiesRouter.route('/run')
.post(UtilController.run);


// Handle get and post of compilation in the same way
utilitiesRouter.route('/getDwenguinoBinary')
.get((req, res) => {
    req["data"] = req.query
    UtilController.getDwenguinoBinary(req, res)
})

utilitiesRouter.route('/getDwenguinoBinary')
.post((req, res) => {
    req["data"] = req.body
    UtilController.getDwenguinoBinary(req, res)
})

utilitiesRouter.route('/getEnvironment')
.get(UtilController.getEnvironment)

export { utilitiesRouter }