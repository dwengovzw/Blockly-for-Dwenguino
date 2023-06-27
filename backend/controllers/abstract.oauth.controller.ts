import jwt from "jsonwebtoken"
import jwt_settings from "../config/jwt.config";
import { User, IUser } from "../models/user.model"
import { IRole, Role } from "../models/role.model"
import oauthConfig from "../config/oauth.config";
import crypto from "crypto"


class AbstractOAuthController {
    platform: string
    constructor(platform:string){
        if (new.target === AbstractOAuthController) {
            throw new TypeError("Cannot construct Abstract instances directly");
          }
        this.platform = platform
    }

     /**
     * Redirect the user to the OAuth login url of the platform they have chosen
     * @param req express request
     * @param res express response
     * @param authState contains information about the OAuth provider to be used.
     */
    login(req, res, authState){
        if (authState.platform !== this.platform){
            return res.status(500).send({message: "Internal server error: platform name does not match controller."})
        }
        // add nonce to both session cookie as well as request to mitigate csrf
        let nonce = crypto.randomBytes(32).toString('hex')
        req.session.nonce = nonce
        authState.nonce = nonce
        let authorizeUrl = 
        oauthConfig.authorizeUrlMap[this.platform](JSON.stringify(authState))
        res.redirect(authorizeUrl);
    }

    redirect(req, res, authState){
        if (authState.platform !== this.platform){
            return res.status(500).send({message: "Internal server error: platform name does not match controller."})
        }
        let state = JSON.parse(req.query.state)
        let reqNonce = state.nonce
        let sessionNonce = req.session.nonce
        // Check if nonce sent in state matches nonce in session cookie. To avoid replay atacks
        /*if (!reqNonce || !sessionNonce || reqNonce !== sessionNonce){
            req.session.nonce = null
            res.status(401).send({ message: "Authentication failed! Nonce did not match" });
        } else {
            req.session.nonce = null
        }*/
    } 


    logout(req, res){
        throw new Error("This method is abstract")
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
            if (user.acceptedTerms) {
                res.redirect(`${process.env.SERVER_URL}${authState.originalTarget}${authState.originalQuery !== '' ? "?" + authState.originalQuery : ""}`)
            } else {
                res.redirect(`${process.env.SERVER_URL}/dashboard`)
            }
            //Save new cookie in session and redirect
        })
    }

    async createUser(req, res, minUserInfo){
        const roles: IRole[] = minUserInfo.getRoles().map(role => new Role({name: role}))
        const userInit: IUser = {
            userId: minUserInfo.getUserId(),
            platform: minUserInfo.getPlatform(),
            email: minUserInfo.getEmail(),
            firstname: minUserInfo.getFirstName(),
            lastname: minUserInfo.getLastName(),
            portfolios: [],
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