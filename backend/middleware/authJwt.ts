import jwt from "jsonwebtoken"
import jwt_settings from "../config/jwt.config";
import { User } from "../models/user.model"


let verifyToken = (req, res, next) => {
    verifyTokenWithRedirect(req, res, next, ((requ, resp) => {
        let originalTarget = requ.originalUrl;
        let originalQuery = new URLSearchParams(requ.query).toString()
        let originalRequestInfo = JSON.stringify({originalTarget: originalTarget, originalQuery: originalQuery})
        res.loggedIn = false
        return resp.redirect(`/dashboard?originalRequestInfo=${originalRequestInfo}`)
    }))
}

/**
 * Verifies if user is logged in if not send 401 (Unauthorized)
 * If the token is valid, add the userId and platform parameter to req
 * @param req 
 * @param res 
 * @param next 
 */
let verifyTokenAjax = (req, res, next) => {
    verifyTokenWithRedirect(req, res, next, ((requ, resp) => {
        resp.loggedIn = false;
        return resp.status(401).send({message: "You are not logged in!"})
    }))
}

let verifyTokenWithRedirect = (req, res, next, redirectAction) => {
    let token  = req.session.token;
    if (!token) {
        return redirectAction(req, res)
        //return res.status(403).send({message: "No token provided"}); // TODO: redirect to login page
    }
    jwt.verify(token, jwt_settings.secret, (err, decoded) => {
        if (err) {
            return redirectAction(req, res)
        }
        req.userId = decoded?.id;
        req.platform = decoded?.platform;
        res.loggedIn = true
        next();
    })
}

let checkIfUserIsLoggedIn = (req, res, next) => {
    let token  = req.session.token;
    if (!token) {
        res.loggedIn = false
        return next()
    }
    jwt.verify(token, jwt_settings.secret, (err, decoded) => {
        if (err) {
            res.loggedIn = false
            return next()
            
        }
        res.loggedIn = true
        return next();
    })
}


let verifyUserExists = async (req, res, next) => {
    try {
        let user = await User.findOne({
            platform: req.platform,
            userId: req.userId
        })
        if (!user){
            res.status(401).send({message: "User does not exist!"})
            return
        }
        req.user = user
        next();
    } catch (err) {
        res.status(500).send({ message: "Error during login" });
    }
    

}
 
// Returns a middleware function that checks if a user has a specific role.
/**
 * Checks if the user has a certain role. If not send 403 (Forbidden)
 * @param role 
 * @returns 
 */
let roleCheck = (role) => {
    return (req, res, next) => {
        User.findOne({
            userId: req.userId, 
            platform: req.platform})
        .exec().then((user) => {
            if (!user){
                res.status(500).send({message: "User does not exist"})
            }
            for (let i = 0; i < user.roles.length; i++) {
                if (user.roles[i].name === role) {
                    next();
                    return;
                }
            }
            res.status(403).send({ message: "You do not have the authority to access this route!" });
            return;
        })
        .catch((err) => {
            if (err){
                res.status(500).send({message: "User does not exist"})
            }
        });
  }
}

export { verifyToken, verifyTokenAjax, roleCheck, verifyUserExists, checkIfUserIsLoggedIn }