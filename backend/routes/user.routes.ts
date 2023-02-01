// Filename: api-routes.js
// Initialize express router
import express from 'express';
import { allAccess, teacherBoard, studentBoard } from "../controllers/test_auth.controller.js"
import { verifyToken, verifyTokenAjax, roleCheck, checkRolesExisted, checkDuplicateUsernameOrEmail } from "../middleware/middleware.js"
import UserController from "../controllers/user.controller.js"

let userRouter = express.Router();
const userController =  new UserController();

userRouter.get("/", (req, res) => {
    res.send("<h1>Success!</h1>");
})

// This is an example route to content that can be accessed by the public
userRouter.get("/all", allAccess);
// This is an example of a non ajax route which also checks if the user has the correct role
userRouter.get("/student", [verifyToken, roleCheck("student")], studentBoard);



userRouter.get("/info", [verifyTokenAjax], userController.info)









export default userRouter;