import express from 'express';
import { verifyTokenAjax, roleCheck, verifyUserExists } from "../middleware/middleware"
import { ClassGroupController } from "../controllers/classgroup.controller.js"

const classGroupController = new ClassGroupController();

let classGroupRouter = express.Router()

classGroupRouter.get("/all", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], classGroupController.all)

classGroupRouter.put("/add", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], classGroupController.add)
classGroupRouter.delete("/delete/:uuid", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], classGroupController.delete)

classGroupRouter.get("/students/:uuid", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], classGroupController.getStudents)
classGroupRouter.get("/pending/:uuid", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], classGroupController.getPending)

classGroupRouter.get("/mine",  [verifyTokenAjax, verifyUserExists, roleCheck("student")], classGroupController.mine)
classGroupRouter.delete("/leave/:uuid",  [verifyTokenAjax, verifyUserExists, roleCheck("student")], classGroupController.leave)
classGroupRouter.put("/join/:sharingCode", [verifyTokenAjax, verifyUserExists, roleCheck("student")], classGroupController.join)

classGroupRouter.get("/:uuid", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], classGroupController.get)
classGroupRouter.put("/:uuid/approve/:studentUuid", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], classGroupController.changeApprovalStatusRouterWrapper(true))
classGroupRouter.delete("/:uuid/reject/:studentUuid", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], classGroupController.changeApprovalStatusRouterWrapper(false))
classGroupRouter.delete("/:uuid/delete/:studentUuid", [verifyTokenAjax, verifyUserExists, roleCheck("teacher")], classGroupController.deleteStudent)

export default classGroupRouter