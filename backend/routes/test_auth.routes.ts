// TODO: replace these routes with oauth calls

// Filename: api-routes.js
// Initialize express router
import express from 'express';
import { verifyToken, roleCheck, checkRolesExisted, checkDuplicateUsernameOrEmail } from "../middleware/middleware.js"
import { signup, signin, signout } from "../controllers/auth.controller.js"

let testRouter = express.Router();

testRouter.post("/auth/signup",
    [
        checkDuplicateUsernameOrEmail,
        checkRolesExisted
    ],
    signup
    )

testRouter.post("/auth/signin", signin);

testRouter.post("/auth/signout", signout);

export default testRouter;