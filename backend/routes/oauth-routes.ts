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

oauthRouter.post("/signup", (req, res) => {
    // Redirect to overview page with auth providers (we do not support user creation ourselves)
});

oauthRouter.post("/signin", (req, res) => {
    // Redirect to overview page with auth providers (we do not support user creation ourselves)
});

oauthRouter.get("/logout", (req, res) => {
    oauthController.logout(req, res);
})



export default oauthRouter;