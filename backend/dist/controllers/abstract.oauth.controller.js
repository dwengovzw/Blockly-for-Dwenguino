import * as jwt from "jsonwebtoken";
import jwt_settings from "../config/jwt.config.js";
import { User } from "../models/users.model.js";
import { Role } from "../models/role.model.js";
class AbstractOAuthController {
    constructor() {
        if (new.target === AbstractOAuthController) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }
    login(req, res, authState) {
        throw new TypeError("This method is abstract!");
    }
    redirect(req, res, authState) {
        throw new TypeError("This method is abstract!");
    }
    async signin(req, res, minUserInfo, authState) {
        // Check if user exists in system
        User.findOne({
            userId: minUserInfo.getUserId(),
            platform: minUserInfo.getPlatform()
        }).populate("roles", "-__v")
            .exec(async (err, u) => {
            let user = u;
            if (err) {
                res.status(500).send({ message: err });
            }
            // If user does not exist, create it
            if (!user) {
                user = await this.createUser(req, res, minUserInfo);
            }
            if (!user) {
                res.status(500).send({ message: "Unable to create user" });
            }
            let token = jwt.sign({ id: user?.userId, platform: user?.platform }, jwt_settings.secret, {
                expiresIn: jwt_settings.expiresIn, // 24h
            });
            var authorities = [];
            if (user?.roles) {
                for (let i = 0; i < user?.roles.length; i++) {
                    authorities.push("ROLE_" + user?.roles[i].name.toUpperCase());
                }
            }
            req.session.token = token;
            //res.send(`<h1>Test</h1><p><a href="${process.env.SERVER_URL}${authState.originalTarget}?${authState.originalQuery}">Return to original page</a></p>`)
            res.redirect(`${process.env.SERVER_URL}${authState.originalTarget}${authState.originalQuery ? "?" + authState.originalQuery : ""}`);
            //Save new cookie in session and redirect
        });
    }
    async createUser(req, res, minUserInfo) {
        const user = new User({
            userId: minUserInfo.getUserId(),
            platform: minUserInfo.getPlatform(),
            email: minUserInfo.getEmail(),
            name: minUserInfo.getName()
        });
        try {
            let newUser = await user.save();
            let roles = await Role.find({
                name: { $in: minUserInfo.getRoles() }
            });
            newUser.roles = roles.map((role) => role._id);
            // Return new user with roles populated.
            return await (await newUser.save()).populate("roles", "-__v");
        }
        catch (err) {
            res.status(500).send({ message: err });
        }
    }
}
export default AbstractOAuthController;
//# sourceMappingURL=abstract.oauth.controller.js.map