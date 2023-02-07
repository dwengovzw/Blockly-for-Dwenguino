import express from 'express';
import { allAccess, teacherBoard, studentBoard } from "../controllers/test_auth.controller.js"
import { verifyToken, verifyTokenAjax, roleCheck, checkRolesExisted, checkDuplicateUsernameOrEmail } from "../middleware/middleware.js"
import { ClassGroupController } from "../controllers/classgroup.controller.js"

const classGroupController = new ClassGroupController();

let classGroupRouter = express.Router()

classGroupRouter.get("/all", [verifyTokenAjax, roleCheck("teacher")], classGroupController.all)

classGroupRouter.put("/add", [verifyTokenAjax, roleCheck("teacher")], classGroupController.add)
classGroupRouter.delete("/delete/:uuid", [verifyTokenAjax, roleCheck("teacher")], classGroupController.delete)
classGroupRouter.get("/:uuid", [verifyTokenAjax, roleCheck("teacher")], classGroupController.get)
classGroupRouter.get("/:uuid/students", [verifyTokenAjax, roleCheck("teacher")], classGroupController.getStudents)
classGroupRouter.get("/:uuid/pending", [verifyTokenAjax, roleCheck("teacher")], classGroupController.getPending)


export default classGroupRouter