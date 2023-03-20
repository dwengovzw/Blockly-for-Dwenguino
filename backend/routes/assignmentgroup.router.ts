import express from 'express';
import { allAccess, teacherBoard, studentBoard } from "../controllers/test_auth.controller.js"
import { verifyToken, verifyTokenAjax, roleCheck, verifyUserExists, checkRolesExisted, checkDuplicateUsernameOrEmail } from "../middleware/middleware.js"
import { AssignmentGroupController } from "../controllers/assignmentgroup.controller.js"

const assignmentGroupController = new AssignmentGroupController();

let assignmentGroupRouter = express.Router()

assignmentGroupRouter.get("/all/:classGroupUUID", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], assignmentGroupController.all)
assignmentGroupRouter.put("/add/:classGroupUUID", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], assignmentGroupController.createForClassGroup)
assignmentGroupRouter.delete("/:uuid", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], assignmentGroupController.delete)

export default assignmentGroupRouter
