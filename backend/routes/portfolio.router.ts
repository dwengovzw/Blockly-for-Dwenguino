import express from 'express';
import { allAccess, teacherBoard, studentBoard } from "../controllers/test_auth.controller.js"
import { verifyToken, verifyTokenAjax, roleCheck, verifyUserExists, checkRolesExisted, checkDuplicateUsernameOrEmail } from "../middleware/middleware.js"
import { PortfolioController } from '../controllers/portfolio.controller.js';

const portfolioController = new PortfolioController();

const portfolioRouter = express.Router();

portfolioRouter.post("/filter", [verifyTokenAjax, verifyUserExists], portfolioController.filter);
portfolioRouter.get("/mine", [verifyTokenAjax, verifyUserExists], portfolioController.mine);
portfolioRouter.get("/students", [verifyTokenAjax, verifyUserExists], portfolioController.students);
portfolioRouter.put("/:uuid/saveItem", [verifyTokenAjax, verifyUserExists, portfolioController.checkIfUserOwnsPortfolio], portfolioController.saveItem)
portfolioRouter.put("/:uuid/createItem", [verifyTokenAjax, verifyUserExists, portfolioController.checkIfUserOwnsPortfolio], portfolioController.createItem)
portfolioRouter.delete("/:uuid/deleteItem/:itemUUID", [verifyTokenAjax, verifyUserExists, portfolioController.checkIfUserOwnsPortfolio], portfolioController.deleteItem)
portfolioRouter.get("/:uuid", [verifyTokenAjax, verifyUserExists,portfolioController.checkIfUserOwnsPortfolio], portfolioController.get);

export { portfolioRouter }