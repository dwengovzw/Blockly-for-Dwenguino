import express from 'express';
import { allAccess, teacherBoard, studentBoard } from "../controllers/test_auth.controller.js"
import { verifyToken, verifyTokenAjax, roleCheck, verifyUserExists, checkRolesExisted, checkDuplicateUsernameOrEmail } from "../middleware/middleware.js"
import { PortfolioController } from '../controllers/portfolio.controller.js';

const portfolioController = new PortfolioController();

const portfolioRouter = express.Router();

portfolioRouter.post("/filter", [verifyTokenAjax, verifyUserExists], portfolioController.filter);
portfolioRouter.get("/mine", [verifyTokenAjax, verifyUserExists], portfolioController.mine);
portfolioRouter.put("/:uuid/saveItem", [verifyTokenAjax, verifyUserExists, portfolioController.checkIfUserOwnsPortfolio], portfolioController.saveItem)
portfolioRouter.get("/:uuid", [verifyTokenAjax, verifyUserExists,portfolioController.checkIfUserOwnsPortfolio], portfolioController.get);

export { portfolioRouter }