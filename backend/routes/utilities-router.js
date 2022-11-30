import express from 'express';
import utilscontroller from '../controllers/util.controller.js';
import cors from 'cors';

let utilitiesRouter = express.Router();

utilitiesRouter.route('/clean')
.get(utilscontroller.clean);

utilitiesRouter.route('/compile')
.get(utilscontroller.compile);

utilitiesRouter.route('/upload')
.get(utilscontroller.upload);

utilitiesRouter.route('/run')
.post(utilscontroller.run);


// Handle get and post of compilation in the same way
utilitiesRouter.route('/getDwenguinoBinary')
.get((req, res) => {
    req["data"] = req.query
    utilscontroller.getDwenguinoBinary(req, res)
})

utilitiesRouter.route('/getDwenguinoBinary')
.post((req, res) => {
    req["data"] = req.body
    utilscontroller.getDwenguinoBinary(req, res)
})

utilitiesRouter.route('/getEnvironment')
.get(utilscontroller.getEnvironment)

export { utilitiesRouter }