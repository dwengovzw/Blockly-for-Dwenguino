import axios from "axios";
import { Octokit } from 'octokit'
import AbstractOAuthController from "./abstract.oauth.controller.js";
import MinimalUserInfo from "../datatypes/minimalUserInfo.js";
import db from "../config/db.config.js"
import oauthConfig from "../config/oauth.config.js";



class GithubOAuthController extends AbstractOAuthController{
    constructor(){
        super();
    }

    login(req, res, authState) {
        if (authState.platform !== db.PLATFORMS.github){
            return res.status(500).send({message: "Internal server error: platform name does not match controller."})
        }
        let authorizeUrl = 
        oauthConfig.authorizeUrlMap[db.PLATFORMS.github](JSON.stringify(authState))
        res.redirect(authorizeUrl);
    }

    /**
     * Github OAuth API redirects to this route when login is successful. 
     * Here we request the oauth token and user info.
     * @param {*} req 
     * @param {*} res 
     */
    redirect(req, res, authState) {
        if (authState.platform !== db.PLATFORMS.github){
            return res.status(500).send({message: "Internal server error: platform name does not match controller."})
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
            })
            try {
                let userInfo = await octo.request("GET /user", {});
                console.log(userInfo);
                let minUserInfo = new MinimalUserInfo(userInfo.data.id,
                    db.PLATFORMS.github, 
                    userInfo.data.name, 
                    userInfo.data.email, 
                    db.ROLES.student)
                this.signin(req, res, minUserInfo, authState); // Call super class method to sign in
            } catch (err) {
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




