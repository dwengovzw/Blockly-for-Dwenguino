import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import jwt_settings from "../config/jwt.config.js";
import { UserInfo } from "os";
import { Role } from "../models/role.model.js"

class UserController {
    constructor(){

    }

    async getInfo(req, res){
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
                    roles: user.roles,
                    platform: user.platform
                }
                return res.status(200).json(userInfo)
            } catch (err){
                return res.status(500).send({message: "Unable to retrieve user"})
            }
        } else {
            return res.status(500).send({message: "Cannot get user info"})
        }
        
    }

    async putInfo(req, res) {
        console.log(req)
        let info = req.body
        let userId = req.userId
        let platform = req.platform
        if (userId && platform){
            try {
                let user = await User.findOne({
                        platform: platform,
                        userId: userId
                })
                user.email = info.email
                user.firstname = info.firstname
                user.lastname = info.lastname
                if (info.birthdate){
                    user.birthdate = new Date(info.birthdate)
                }
                user.roles = info.roles.map(role => new Role({name: role}))
                let userInfo = {
                    loggedIn: true,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    birthdate: user.birthdate,
                    roles: user.roles,
                    platform: user.platform
                }
                await user.save();
                return res.status(200).json(userInfo)
            } catch (err) {
                console.log("Failed to save user data")
            }
        }
    }

}

export default UserController