import express from 'express';
import { allAccess, teacherBoard, studentBoard } from "../controllers/test_auth.controller.js"
import { verifyToken, verifyTokenAjax, roleCheck, verifyUserExists, checkRolesExisted, checkDuplicateUsernameOrEmail } from "../middleware/middleware.js"
import { ClassGroupController } from "../controllers/classgroup.controller.js"

const classGroupController = new ClassGroupController();

let classGroupRouter = express.Router()

classGroupRouter.get("/all", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], classGroupController.all)

classGroupRouter.put("/add", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], classGroupController.add)
classGroupRouter.delete("/delete/:uuid", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], classGroupController.delete)
classGroupRouter.get("/:uuid", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], classGroupController.get)
classGroupRouter.get("/:uuid/students", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], classGroupController.getStudents)
classGroupRouter.get("/:uuid/pending", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], classGroupController.getPending)

classGroupRouter.get("/mine",  [verifyTokenAjax, verifyUserExists, roleCheck("student")], classGroupController.mine)
classGroupRouter.delete("/:uuid/leave",  [verifyTokenAjax, verifyUserExists, roleCheck("student")], classGroupController.leave)
classGroupRouter.put("/:sharingCode/join", [verifyTokenAjax, verifyUserExists, roleCheck("student")], classGroupController.join)


export default classGroupRouter