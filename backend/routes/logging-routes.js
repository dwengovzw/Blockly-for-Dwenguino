import express from 'express';
import logcontroller from '../controllers/log.controller.js';

let loggingRouter = express.Router();


loggingRouter.route('/newSessionId')
.get(logcontroller.newSessionId);

loggingRouter.route('/event')
.post(logcontroller.event);

export { loggingRouter }