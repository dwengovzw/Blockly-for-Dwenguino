// Filename: api-routes.js
// Initialize express router
import express from 'express';
import { allAccess, teacherBoard, studentBoard } from "../controllers/test_auth.controller.js"
import { verifyToken, verifyTokenAjax, roleCheck, verifyUserExists, checkRolesExisted, checkDuplicateUsernameOrEmail } from "../middleware/middleware.js"
import SavedProgramController from "../controllers/saved_program.controller.js"


let savedProgramsRouter = express.Router()
const saveProgramController = new SavedProgramController()

savedProgramsRouter.post("/save", [verifyTokenAjax, verifyUserExists], (req, res) => {
    saveProgramController.save(req, res)
})

savedProgramsRouter.post("remove", [verifyTokenAjax, verifyUserExists], (req, res) => {
    saveProgramController.remove(req, res)
})

savedProgramsRouter.get("/all", [verifyTokenAjax, verifyUserExists], (req, res) => {
    saveProgramController.all(req, res)
})

export default savedProgramsRouter