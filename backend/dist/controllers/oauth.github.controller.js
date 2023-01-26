import axios from "axios";
import { Octokit } from 'octokit';
import AbstractOAuthController from "./abstract.oauth.controller.js";
import MinimalUserInfo from "../datatypes/minimalUserInfo.js";
import db from "../config/db.config.js";
import oauthConfig from "../config/oauth.config.js";
import crypto from "crypto";
class GithubOAuthController extends AbstractOAuthController {
    constructor() {
        super();
    }
    /**
     * Redirect the user to the OAuth login url of the platform they have chosen
     * @param req express request
     * @param res express response
     * @param authState contains information about the OAuth provider to be used.
     */
    login(req, res, authState) {
        if (authState.platform !== db.PLATFORMS.github) {
            return res.status(500).send({ message: "Internal server error: platform name does not match controller." });
        }
        // add nonce to both session cookie as well as request state to mitigate csrf
        let nonce = crypto.randomBytes(128).toString('hex');
        req.session.nonce = nonce;
        authState.nonce = nonce;
        let authorizeUrl = oauthConfig.authorizeUrlMap[db.PLATFORMS.github](JSON.stringify(authState));
        res.redirect(authorizeUrl);
    }
    /**
     * Github OAuth API redirects to this route when login is successful.
     * Here we request the oauth token and user info.
     * @param {*} req
     * @param {*} res
     */
    redirect(req, res, authState) {
        if (authState.platform !== db.PLATFORMS.github) {
            return res.status(500).send({ message: "Internal server error: platform name does not match controller." });
        }
        let reqNonce = authState.nonce;
        let sessionNonce = req.session.nonce;
        // Check if nonce sent in state matches nonce in session cookie. To prevent replay attack
        if (!reqNonce || !sessionNonce || reqNonce !== sessionNonce) {
            req.session.nonce = null;
            res.status(401).send({ message: "Authentication failed! Nonce did not match" });
        }
        else {
            req.session.nonce = null;
        }
        axios({
            method: "POST",
            url: oauthConfig.accessTokenUrlMap[authState.platform](req.query.code),
            headers: {
                Accept: "application/json"
            }
        }).then(async (response) => {
            const octo = new Octokit({
                auth: response.data.access_token
            });
            try {
                let userInfo = await octo.request("GET /user", {});
                console.log(userInfo);
                let minUserInfo = new MinimalUserInfo(userInfo.data.id, db.PLATFORMS.github, userInfo.data.name, userInfo.data.email, db.ROLES.student);
                this.signin(req, res, minUserInfo, authState); // Call super class method to sign in
            }
            catch (err) {
                console.log(err);
                res.status(401).send({ message: "Authentication failed!" });
            }
            // Get user info, check if user exists
            //  yes -> create session token for user
            //  no -> create user and create session token for user.
            // Create session token based on access token + check for errors + redirect to login page with valid session token.
            //res.redirect(`http://localhost:12032/dashboard?access_token=${response.data.access_token}`)
        }).catch((err) => {
            res.status(401).send({ message: "Authentication failed!" });
        });
    }
}
export default GithubOAuthController;
//# sourceMappingURL=oauth.github.controller.js.map