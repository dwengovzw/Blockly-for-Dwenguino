import express from 'express';
import { OAuthController } from "../controllers/oauth.controller.js"

let oauthRouter = express.Router();
const oauthController = new OAuthController();

oauthRouter.get("/redirect", (req, res) => {
    oauthController.redirect(req, res);
})

oauthRouter.get("/login", (req, res) => {
    oauthController.login(req, res);
})


oauthRouter.get("/logout", (req, res) => {
    oauthController.logout(req, res);
})

oauthRouter.get("/platforms", (req, res) => {
    oauthController.getPlatforms(req, res);
})



export default oauthRouter;