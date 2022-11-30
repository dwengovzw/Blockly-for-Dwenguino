// Filename: api-routes.js
// Initialize express router
import express from 'express';
import { allAccess, teacherBoard, studentBoard } from "../controllers/test_auth.controller.js"
import { verifyToken, roleCheck, checkRolesExisted, checkDuplicateUsernameOrEmail } from "../middleware/middleware.js"

let userRouter = express.Router();

userRouter.get("/", (req, res) => {
    res.send("<h1>Success!</h1>");
})

userRouter.get("/all", allAccess);

userRouter.get("/student", [verifyToken, roleCheck("student")], studentBoard);

userRouter.get("/teacher", [verifyToken, roleCheck("teacher")], teacherBoard);



export default userRouter;