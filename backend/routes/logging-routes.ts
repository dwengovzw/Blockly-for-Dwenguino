import express from 'express';
import { newSessionId, event } from '../controllers/log.controller.js';

let loggingRouter = express.Router();


loggingRouter.route('/newSessionId')
.get(newSessionId);

loggingRouter.route('/event')
.post(event);

export { loggingRouter } 