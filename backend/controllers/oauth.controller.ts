import OAuthState from "../datatypes/oauthState";
import db from "../config/db.config"


class OAuthController {
    oauthControllers = {}
    constructor(oauthControllers){
        this.oauthControllers = oauthControllers
    }

    /**
     * This controller action is executed when a user presses the login button on our website.
     * It checks if the req.query.platform parameter exists and is a known platform.
     * Thereafter, it calls the login function of the respective OAuth provider.
     * @param req 
     * @param res 
     */
    login(req, res){
        let platform = req.query?.platform;
        let originalRequestInfo = req.query?.originalRequestInfo;
        console.log("Test test ------------------------------->>>", db.PLATFORMS);
        console.log("Test test ------------------------------->>>", platform);
        if (!Object.values(db.PLATFORMS).includes(platform)){
            return res.status(401).send({ message: "Selected platform not supported!" });
        }
        let state;
        if (originalRequestInfo){
            let reqInfo = JSON.parse(originalRequestInfo);
            state = new OAuthState(db.PLATFORMS[platform], reqInfo.originalTarget, reqInfo.originalQuery);
        } else {
            state = new OAuthState(db.PLATFORMS[platform]);
        }
        this.oauthControllers[state.platform].login(req, res, state);
    }

    /**
     * This controller action is executed on a redirect action from the OAuth provider
     * @param req 
     * @param res 
     */
    redirect(req, res) {
        let state = req.query?.state ? JSON.parse(req.query?.state) : {}
        if (state.platform && Object.values(db.PLATFORMS).includes(state.platform)){
            this.oauthControllers[state.platform].redirect(req, res, state);
        } else {
            res.status(401).send({ message: "Authentication failed! Unknown OAuth platform" });
        }
    }

    logout(req, res){
        let platform = req.platform
        req.session.token = null;
        this.oauthControllers[platform].logout(req, res)
    }

    getPlatforms(req, res){
        res.json(db.PLATFORMS)
    }
}

export { OAuthController }