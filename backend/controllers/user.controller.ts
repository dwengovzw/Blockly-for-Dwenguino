import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import jwt_settings from "../config/jwt.config.js";

class UserController {
    constructor(){

    }

    async info(req, res){
        let userId = req.userId
        let platform = req.platform
        if (userId && platform){
            try {
                let user = await User.findOne({
                    platform: platform,
                    userId: userId
                })
                let userInfo = {
                    loggedIn: true,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    birthdate: user.birthdate,
                    roles: user.roles
                }
                return res.status(200).json(userInfo)
            } catch (err){
                return res.status(500).send({message: "Unable to retrieve user"})
            }
        } else {
            return res.status(500).send({message: "Cannot get user info"})
        }
        
    }

}

export default UserController