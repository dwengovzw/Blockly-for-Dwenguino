import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import jwt_settings from "../config/jwt.config.js";

class UserController {
    constructor(){

    }

    async isLoggedIn(req, res){
        let token  = req.session.token;
        if (!token) {
            return res.status(401).send(false); // TODO: redirect to login page
        }
        jwt.verify(token, jwt_settings.secret as string, async (err, decoded) => {
            if (err) {
                return res.status(401).send(false)
            }
            try{
                let platform = decoded?.platform;
                let userId = decoded?.id;
                let user = await User.findOne({
                    platform: platform,
                    userId: userId
                })
                if (!user || !user.firstname){
                    res.status(200).send("No display name set");
                }
                return res.status(200).send(user?.firstname)
            } catch (e) {
                return res.status(401).send({message: e})
            }
        })
    }

    async getName(req, res){
        let platform = req.platform;
        let userId = req.userId;
        if (platform && userId){
            try{
                let user = await User.findOne({
                    platform: platform,
                    userId: userId
                })
                if (!user || !user.firstname){
                    return res.status(200).send("No display name set");
                }
                return res.status(200).send(user?.firstname)
            } catch (e) {
                return res.status(401).send({message: e})
            }
            
        } else {
            return res.status(401).send({message: "Cannot get name"})
        }
    }
}

export default UserController