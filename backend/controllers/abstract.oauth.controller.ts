import jwt from "jsonwebtoken"
import jwt_settings from "../config/jwt.config";
import { User, IUser } from "../models/user.model"
import { IRole, Role } from "../models/role.model"
import crypto from "crypto"


class AbstractOAuthController {
    platform: string
    oauthConfig: any
    constructor(platform:string, oauthConfig: any){
        if (new.target === AbstractOAuthController) {
            throw new TypeError("Cannot construct Abstract instances directly");
          }
        this.platform = platform
        this.oauthConfig = oauthConfig
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
        this.oauthConfig.authorizeUrlMap[this.platform](JSON.stringify(authState))
        res.redirect(authorizeUrl);
    }

    redirect(req, res, authState){
        if (authState.platform !== this.platform){
            return res.status(500).send({message: "Internal server error: platform name does not match controller."})
        }
    } 


    logout(req, res){
        throw new Error("This method is abstract")
    }

    async signin(req, res, minUserInfo, authState) {
        // Check if user exists in system
        User.findOne({
            userId: minUserInfo.getUserId(),
            platform: minUserInfo.getPlatform()
        }).exec().then(async (u) => {
            let user:IUser = u as IUser
            
            // If user does not exist, create it
            if (!user){
                user = await this.createUser(req, res, minUserInfo) as IUser
                if (!user){
                    return res.status(500).send({message: "Unable to create user"})            
                }
            }
            
            let token = jwt.sign({id: user?.userId, platform: user?.platform }, jwt_settings.secret as string, {
                expiresIn: jwt_settings.expiresIn, // 24h
            })        
    
            req.session.token = token;
            //res.send(`<h1>Test</h1><p><a href="http://${process.env.SERVER_URL}${authState.originalTarget}${authState.originalQuery !== '' ? "?" + authState.originalQuery : ""}">Return to original page</a></p>`)
            if (user.acceptedTerms) {
                return res.redirect(`${process.env.SERVER_URL}${authState.originalTarget}${authState.originalQuery !== '' ? "?" + authState.originalQuery : ""}`)
            } else {
                return res.redirect(`${process.env.SERVER_URL}/dashboard`)
            }
        }, (err)=>{
            console.log(`Promise rejected with ${err}`);
            return res.status(500).send({message: err})
        }).catch((err) => {
            return res.status(500).send({message: err})
        });
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