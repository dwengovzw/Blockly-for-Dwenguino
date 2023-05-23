import express from 'express';
import { verifyTokenAjax, verifyUserExists } from "../middleware/middleware"
import { PortfolioController } from '../controllers/portfolio.controller';

const portfolioController = new PortfolioController();

const portfolioRouter = express.Router();

portfolioRouter.post("/filter", [verifyTokenAjax, verifyUserExists], portfolioController.filter);
portfolioRouter.get("/mine", [verifyTokenAjax, verifyUserExists], portfolioController.mine);
portfolioRouter.get("/sharedWithMe", [verifyTokenAjax, verifyUserExists], portfolioController.sharedWithMe);
portfolioRouter.put("/:uuid/saveItem", [verifyTokenAjax, verifyUserExists, portfolioController.checkIfUserHasAccessToPortfolio, portfolioController.checkIfUserCanCreateItemType], portfolioController.saveItem)
portfolioRouter.put("/:uuid/createItem", [verifyTokenAjax, verifyUserExists, portfolioController.checkIfUserHasAccessToPortfolio, portfolioController.checkIfUserCanCreateItemType], portfolioController.createItem)
portfolioRouter.delete("/:uuid/deleteItem/:itemUUID", [verifyTokenAjax, verifyUserExists, portfolioController.checkIfUserHasAccessToPortfolio], portfolioController.deleteItem)
portfolioRouter.get("/:uuid", [verifyTokenAjax, verifyUserExists,portfolioController.checkIfUserHasAccessToPortfolio], portfolioController.get);


export { portfolioRouter }