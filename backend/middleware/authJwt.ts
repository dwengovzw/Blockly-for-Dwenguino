import jwt from "jsonwebtoken"
import db from "../config/db.config.js"
import jwt_settings from "../config/jwt.config.js";
import { User } from "../models/users.model.js"
import { Role } from "../models/role.model.js"


let verifyToken = (req, res, next) => {
    let token  = req.session.token;
    console.log(req.originalUrl)
    console.log(new URLSearchParams(req.query).toString())
    let originalTarget = req.originalUrl;
    let originalQuery = new URLSearchParams(req.query).toString()
    let originalRequestInfo = JSON.stringify({originalTarget: originalTarget, originalQuery: originalQuery})
    if (!token) {
        return res.redirect(`/dashboard?originalRequestInfo=${originalRequestInfo}`)
        //return res.status(403).send({message: "No token provided"}); // TODO: redirect to login page
    }
    jwt.verify(token, jwt_settings.secret, (err, decoded) => {
        if (err) {
            return res.redirect(`/dashboard?originalRequestInfo=${originalRequestInfo}`)
        }
        req.userId = decoded?.id;
        req.platform = decoded?.platform;
        next();
    })
}

// Returns a middleware function that checks if a user has a specific role.
let roleCheck = (role) => {
    return (req, res, next) => {
        User.findOne({
            userId: req.userId, 
            platform: req.platform})
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
    
            Role.find(
                {
                _id: { $in: user.roles },
                },
                (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
        
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === role) {
                    next();
                    return;
                    }
                }
                res.status(403).send({ message: "You do not have the authority to access this route!" });
                return;
                }
            );
        });
  }
}

export { verifyToken, roleCheck }