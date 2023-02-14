import jwt from "jsonwebtoken"
import jwt_settings from "../config/jwt.config.js";
import { User, IUser } from "../models/user.model.js"
import { IRole, Role } from "../models/role.model.js"
import mongoose from "mongoose";
import { Populated } from "../models/modelutils.js"


class AbstractOAuthController {
    constructor(){
        if (new.target === AbstractOAuthController) {
            throw new TypeError("Cannot construct Abstract instances directly");
          }
    }

    login(req, res, authState){
        throw new TypeError("This method is abstract!")
    }

    redirect(req, res, authState){
        throw new TypeError("This method is abstract!")
    } 

    async signin(req, res, minUserInfo, authState) {
        // Check if user exists in system
        User.findOne({
            userId: minUserInfo.getUserId(),
            platform: minUserInfo.getPlatform()
        }).exec(async (err, u) => {
            let user:IUser = u as IUser
            if (err) {
                res.status(500).send({message: err})
            }
            // If user does not exist, create it
            if (!user){
                user = await this.createUser(req, res, minUserInfo) as IUser
                if (!user){
                    res.status(500).send({message: "Unable to create user"})            
                }
            }
            

            let token = jwt.sign({id: user?.userId, platform: user?.platform }, jwt_settings.secret as string, {
                expiresIn: jwt_settings.expiresIn, // 24h
            })        
    
            req.session.token = token;
            //res.send(`<h1>Test</h1><p><a href="http://${process.env.SERVER_URL}${authState.originalTarget}${authState.originalQuery !== '' ? "?" + authState.originalQuery : ""}">Return to original page</a></p>`)
            res.redirect(`${process.env.SERVER_URL}${authState.originalTarget}${authState.originalQuery !== '' ? "?" + authState.originalQuery : ""}`)
            //Save new cookie in session and redirect
        })
    }

    async createUser(req, res, minUserInfo){
        const roles: IRole[] = minUserInfo.getRoles().map(role => new Role({name: role}))
        const userInit: IUser = {
            userId: minUserInfo.getUserId(),
            platform: minUserInfo.getPlatform(),
            email: minUserInfo.getEmail(),
            firstname: minUserInfo.getName(),
            roles: roles
        }
        const user = new User(userInit)
        try {
            let newUser = await user.save();
            // Return new user with roles populated.
            return newUser
        } catch (err){
            res.status(500).send({message: err});
        }
        
    }

}

export default AbstractOAuthController;