import { User, IUser } from "../models/user.model";
import AbstractOAuthController from "./abstract.oauth.controller";
import db from "../config/db.config"
import jwt from "jsonwebtoken"
import oauthConfig from "../config/oauth.config";
import jwt_settings from "../config/jwt.config";

class MockAuthController extends AbstractOAuthController{
    constructor(){
        super(db.PLATFORMS.github, oauthConfig);
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
            platform: (db.PLATFORMS as Record<string, string>).test
        }).then(async (u) => {
            let user:IUser = u as IUser
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
            if (user.acceptedTerms) {
                res.redirect(`${process.env.SERVER_URL}${authState.originalTarget}${authState.originalQuery !== '' ? "?" + authState.originalQuery : ""}`)
            } else {
                res.redirect(`${process.env.SERVER_URL}/dashboard`)
            }
        }).catch((err) => {
            if (err) {
                res.status(500).send({message: err})
            }
        });
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
        res.redirect(`${process.env.SERVER_URL}`)
    }
}


export default MockAuthController;
