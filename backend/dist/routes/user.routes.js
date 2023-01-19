// Filename: api-routes.js
// Initialize express router
import express from 'express';
import { allAccess, teacherBoard, studentBoard } from "../controllers/test_auth.controller.js";
import { verifyToken, roleCheck } from "../middleware/middleware.js";
import UserController from "../controllers/user.controller.js";
let userRouter = express.Router();
const userController = new UserController();
userRouter.get("/", (req, res) => {
    res.send("<h1>Success!</h1>");
});
userRouter.get("/all", allAccess);
userRouter.get("/student", [verifyToken, roleCheck("student")], studentBoard);
userRouter.get("/teacher", [verifyToken, roleCheck("teacher")], teacherBoard);
userRouter.get("/isLoggedIn", userController.isLoggedIn);
export default userRouter;
//# sourceMappingURL=user.routes.js.map