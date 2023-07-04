// Filename: api-routes.js
// Initialize express router
import express from 'express';
import { allAccess, studentBoard } from "../controllers/test_auth.controller"
import { verifyToken, verifyTokenAjax, roleCheck, verifyUserExists } from "../middleware/middleware"
import UserController from "../controllers/user.controller"

let userRouter = express.Router();
const userController =  new UserController();

userRouter.get("/", (req, res) => {
    res.send("<h1>Success!</h1>");
})

// This is an example route to content that can be accessed by the public
userRouter.get("/all", allAccess);
// This is an example of a non ajax route which also checks if the user has the correct role
userRouter.get("/student", [verifyToken, verifyUserExists, roleCheck("student")], studentBoard);



userRouter.get("/info", [verifyTokenAjax, verifyUserExists], userController.getInfo)
userRouter.put("/info", [verifyTokenAjax, verifyUserExists], userController.putInfo)

userRouter.get("/publicInfo/:uuid", [verifyTokenAjax, verifyUserExists], userController.publicInfo)









export default userRouter;