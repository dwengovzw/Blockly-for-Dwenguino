import GithubOAuthController from "./oauth.github.controller.js";
import OAuthState from "../datatypes/oauthState.js";
import db from "../config/db.config.js";
const oauthControllers = {};
const githubOAuthController = new GithubOAuthController();
oauthControllers[db.PLATFORMS.github] = githubOAuthController;
class OAuthController {
    constructor() {
    }
    login(req, res) {
        let platform = req.query?.platform;
        let originalRequestInfo = req.query?.originalRequestInfo;
        if (!Object.values(db.PLATFORMS).includes(platform)) {
            res.status(401).send({ message: "Selected platform not supported!" });
        }
        let state;
        if (originalRequestInfo) {
            let reqInfo = JSON.parse(originalRequestInfo);
            state = new OAuthState(db.PLATFORMS[platform], reqInfo.originalTarget, reqInfo.originalQuery);
        }
        else {
            state = new OAuthState(db.PLATFORMS[platform]);
        }
        oauthControllers[state.platform].login(req, res, state);
        //res.redirect(oauthConfig.platformUrlMap[platform]) // Redirect to the oauth provider for the selected platform
    }
    redirect(req, res) {
        console.log(req.query.state);
        console.log(JSON.parse(req.query?.state));
        let state = JSON.parse(req.query?.state);
        if (Object.values(db.PLATFORMS).includes(state.platform)) {
            oauthControllers[state.platform].redirect(req, res, state);
        }
        else {
            res.status(401).send({ message: "Authentication failed! Unknown OAuth platform" });
        }
    }
    logout(req, res) {
        req.session.token = null;
        res.redirect("/dashboard");
        //res.status(200).send({message: "Logout successful"})
    }
}
export { OAuthController };
//# sourceMappingURL=oauth.controller.js.map