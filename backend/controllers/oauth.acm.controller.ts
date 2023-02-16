import axios from "axios";
import AbstractOAuthController from "./abstract.oauth.controller.js";
import db from "../config/db.config.js"
import oauthConfig from "../config/oauth.config.js";
import crypto from "crypto"
import MinimalUserInfo from "../datatypes/minimalUserInfo.js";

class ACMOAuthController extends AbstractOAuthController {
    constructor() {
        super(db.PLATFORMS.beACM)
    }

    /**
     * LeerId OAuth API redirects to this route when login is successful. 
     * Here we request the oauth token and user info.
     * @param {*} req 
     * @param {*} res 
     */
    redirect(req, res, authState) {
        super.redirect(req, res, authState)
        // Get access token
        axios({
            method: "POST",
            url: oauthConfig.accessTokenUrlMap[authState.platform](req.query.code),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: oauthConfig.queryStringMap[authState.platform](req.query.code)
        }).then(async (response) => {
            // Get user info
            let access_token = response.data.access_token
            console.log(`${new Date().toLocaleString()}: Sending new request.`)
            axios({
                method: "GET",
                url: process.env.LEERID_OAUTH_USERINFO_URL,
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(async (id_response) => {
                console.log(id_response)
                try {
                    let minimalUserInfo = new MinimalUserInfo(
                        id_response.data.sub,
                        db.PLATFORMS.beACM,
                        id_response.data.given_name,
                        id_response.data.family_name,
                        "",
                        [db.ROLES.teacher, db.ROLES.user]
                    )
                    this.signin(req, res, minimalUserInfo, authState)
                } catch (err) {
                    console.log(err);
                    res.status(401).send({ message: "Authentication failed!" });
                }
                
            }).catch(err => {
                console.log(`${new Date().toLocaleString()}: .
                Received response headers:
                    ${JSON.stringify(err.response.headers)}
                Received response data:
                    ${JSON.stringify(err.response.data)}
                .`)
            })

        }).catch((err) => {
            res.status(401).send({ message: "Authentication failed!" });
        });
    }
    logout(req, res){
        axios({
            method: "get", 
            url: oauthConfig.logoutUrlMap[db.PLATFORMS.beACM]
        }).then(async (resp) => {
            console.log("Starting logout")
        }).catch(err => {
            console.log("Unable to logout" + err)
        });   
    }
}

export default ACMOAuthController