import jwt from "jsonwebtoken"
import db from "../config/db.config.js"
import jwt_secret from "../config/jwt.config.js";

const User = db.user;
const Role = db.role;

let verifyToken = (req, res, next) => {
    let token  = req.session.token;
    if (!token) {
        return res.status(403).send({message: "No token provided"}); // TODO: redirect to login page
    }
    jwt.verify(token, jwt_secret.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({message: "Unauthorized"}) // TODO: redirect to login page
        }
        req.userId = decoded?.id;
        next();
    })
}

// Returns a middleware function that checks if a user has a specific role.
let roleCheck = (role) => {
    return (req, res, next) => {
        User.findById(req.userId).exec((err, user) => {
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