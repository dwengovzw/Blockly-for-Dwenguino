// Filename: api-routes.js
// Initialize express router
import express from 'express';
import { verifyTokenAjax, verifyUserExists } from "../middleware/middleware"
import SavedProgramController from "../controllers/saved_program.controller.js"


let savedProgramsRouter = express.Router()
const saveProgramController = new SavedProgramController()

savedProgramsRouter.post("/save", [verifyTokenAjax, verifyUserExists], (req, res) => {
    saveProgramController.save(req, res)
})

savedProgramsRouter.delete("/delete/:uuid", [verifyTokenAjax, verifyUserExists], (req, res) => {
    saveProgramController.delete(req, res)
})

savedProgramsRouter.get("/all", [verifyTokenAjax, verifyUserExists], (req, res) => {
    saveProgramController.all(req, res)
})

savedProgramsRouter.get("/open", [verifyTokenAjax, verifyUserExists], (req, res) => {
    saveProgramController.open(req, res)
})

export default savedProgramsRouter