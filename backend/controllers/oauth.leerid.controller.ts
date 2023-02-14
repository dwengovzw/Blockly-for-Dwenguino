import axios from "axios";
import { Octokit } from 'octokit'
import AbstractOAuthController from "./abstract.oauth.controller.js";
import db from "../config/db.config.js"
import oauthConfig from "../config/oauth.config.js";
import crypto from "crypto"


class LeerIdOAuthController extends AbstractOAuthController{
    constructor(){
        super();
    }

    /**
     * Redirect the user to the OAuth login url of the platform they have chosen
     * @param req express request
     * @param res express response
     * @param authState contains information about the OAuth provider to be used.
     */
    login(req, res, authState) {
        if (authState.platform !== db.PLATFORMS.leerId){
            return res.status(500).send({message: "Internal server error: platform name does not match controller."})
        }
        // add nonce to both session cookie as well as request to mitigate csrf
        let nonce = crypto.randomBytes(128).toString('hex')
        req.session.nonce = nonce
        authState.nonce = nonce
        let authorizeUrl = 
        oauthConfig.authorizeUrlMap[db.PLATFORMS.leerId](JSON.stringify(authState))
        res.redirect(authorizeUrl);
    }

    /**
     * LeerId OAuth API redirects to this route when login is successful. 
     * Here we request the oauth token and user info.
     * @param {*} req 
     * @param {*} res 
     */
    redirect(req, res, authState) {
        
        if (authState.platform !== db.PLATFORMS.leerId){
            return res.status(500).send({message: "Internal server error: platform name does not match controller."})
        }
        let state = JSON.parse(req.query.state)
        let reqNonce = state.nonce
        let sessionNonce = req.session.nonce
        // Check if nonce sent in state matches nonce in session cookie. To avoid replay atacks
        if (!reqNonce || !sessionNonce || reqNonce !== sessionNonce){
            req.session.nonce = null
            res.status(401).send({ message: "Authentication failed! Nonce did not match" });
        } else {
            req.session.nonce = null
        }
        axios({
            method: "POST",
            url: oauthConfig.accessTokenUrlMap[authState.platform](req.query.code),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: oauthConfig.queryStringMap[authState.platform](req.query.code)
        }).then(async (response) => {
            console.log(response)    
            let access_token = response.data.access_token
            axios({
                method: "GET",
                url: process.env.LEERID_OAUTH_USERINFO_URL,
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(async (id_response) => {
                console.log(id_response)
            }).catch(err => {
                console.log(err)
            })

        }).catch((err) => {
            res.status(401).send({ message: "Authentication failed!" });
        });
    }
}

export default LeerIdOAuthController;





