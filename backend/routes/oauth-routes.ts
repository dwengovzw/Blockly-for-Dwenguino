import express from 'express';
import { OAuthController } from "../controllers/oauth.controller"
import { verifyToken } from "../middleware/middleware"
import db from '../config/db.config';
import ACMOAuthController from '../controllers/oauth.acm.controller';
import GithubOAuthController from '../controllers/oauth.github.controller';
import LeerIdOAuthController from '../controllers/oauth.leerid.controller';
import MockAuthController from '../controllers/oauth.mock.controller';

const oauthControllers = {}
const githubOAuthController = new GithubOAuthController();
const leerIdOAuthController = new LeerIdOAuthController();
const acmOAuthController = new ACMOAuthController();
const mockOAuthController = new MockAuthController();
oauthControllers[db.PLATFORMS.github] = githubOAuthController;
oauthControllers[db.PLATFORMS.leerId] = leerIdOAuthController;
oauthControllers[db.PLATFORMS.beACM] = acmOAuthController;
if (process.env.NODE_ENV == "development" && (db.PLATFORMS as Record<string, string>).test){
    oauthControllers[(db.PLATFORMS as Record<string, string>).test] = mockOAuthController;
}

let oauthRouter = express.Router();
const oauthController = new OAuthController(oauthControllers);

oauthRouter.get("/redirect", (req, res) => {
    oauthController.redirect(req, res);
})

oauthRouter.get("/login", (req, res) => {
    oauthController.login(req, res);
})


oauthRouter.get("/logout", [verifyToken], (req, res) => {
    oauthController.logout(req, res);
})

oauthRouter.get("/platforms", (req, res) => {
    oauthController.getPlatforms(req, res);
})



export default oauthRouter;