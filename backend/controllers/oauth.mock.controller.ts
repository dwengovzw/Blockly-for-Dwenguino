import { User, IUser } from "../models/user.model.js";
import AbstractOAuthController from "./abstract.oauth.controller.js";
import MinimalUserInfo from "../datatypes/minimalUserInfo.js";
import db from "../config/db.config.js"
import jwt from "jsonwebtoken"
import jwt_settings from "../config/jwt.config.js";

class MockAuthController extends AbstractOAuthController{
    constructor(){
        super(db.PLATFORMS.github);
    }

    /**
     * This method overrides the default oauth login flow and just logs in the user = starts session.
     * This is for testing only!
     * @param req 
     * @param res 
     * @param authState 
     */
    login(req, res, authState){
        let userId = req.query?.userId
        if (!userId){
            res.send(401).send({message: "Authentication failed"})
        }
        User.findOne({
            userId: userId,
            platform: db.PLATFORMS.test
        }).exec(async (err, u) => {
            let user:IUser = u as IUser
            if (err) {
                res.status(500).send({message: err})
                return
            }
            // If user does not exist, create it
            if (!user){
                res.send(401).send({message: "User does not exist"})
                return
            }
            
            let token = jwt.sign({id: user?.userId, platform: user?.platform }, jwt_settings.secret as string, {
                expiresIn: jwt_settings.expiresIn, // 24h
            })        
            //Save new cookie in session and redirect
            req.session.token = token;
            //res.send(`<h1>Test</h1><p><a href="http://${process.env.SERVER_URL}${authState.originalTarget}${authState.originalQuery !== '' ? "?" + authState.originalQuery : ""}">Return to original page</a></p>`)
            res.redirect(`${process.env.SERVER_URL}${authState.originalTarget}${authState.originalQuery !== '' ? "?" + authState.originalQuery : ""}`)

        })

    }


    /**
     * Github OAuth API redirects to this route when login is successful. 
     * Here we request the oauth token and user info.
     * @param {*} req 
     * @param {*} res 
     */
    redirect(req, res, authState) {
        // This method doen't do anything
        super.redirect(req, res, authState) // Do general checks like nonce verification and platform check 
    }

    logout(req, res){
        res.status(200).send({message: "Logout successful"})  
    }
}


export default MockAuthController;
