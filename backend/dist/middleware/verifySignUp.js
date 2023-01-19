import db from "../config/db.config.js";
const ROLES = db.ROLES;
const User = db.user;
// These middleware functions check if the user can be created. However, we will not need this initially since we will work with oauth tokens
// For oauth, we should check if the user is known in our db (probably using an e-mailadress). If they are known, we update their information if needed using OpenID.
// If they do not exist, we create a new user in our database with the information available from OpenID
let checkDuplicateUsernameOrEmail = (req, res, next) => {
    if (!(req.body?.username && req.body?.email)) {
        res.status(400).send({ message: "Failed, no username or password supplied" });
    }
    // Username
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user) {
            res.status(400).send({ message: "Failed! Username is already in use!" });
            return;
        }
        // Email
        User.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (user) {
                res.status(400).send({ message: "Failed! Email is already in use!" });
                return;
            }
            next();
        });
    });
};
let checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `Failed! Role ${req.body.roles[i]} does not exist!`
                });
                return;
            }
        }
    }
    next();
};
export { checkRolesExisted, checkDuplicateUsernameOrEmail };
//# sourceMappingURL=verifySignUp.js.map