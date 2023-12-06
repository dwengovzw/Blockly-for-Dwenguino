import express from 'express';
import { verifyTokenAjax, roleCheck, verifyUserExists } from "../middleware/middleware"
import { AssignmentGroupController } from "../controllers/assignmentgroup.controller"

const assignmentGroupController = new AssignmentGroupController();

let assignmentGroupRouter = express.Router()

assignmentGroupRouter.get("/all/:classGroupUUID", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], assignmentGroupController.all)
assignmentGroupRouter.put("/add/:classGroupUUID", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], assignmentGroupController.createForClassGroup)
assignmentGroupRouter.delete("/:uuid", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], assignmentGroupController.delete)
assignmentGroupRouter.put("/favorite/:uuid", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], assignmentGroupController.favorite)

export default assignmentGroupRouter