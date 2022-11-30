import express from 'express';
import axios from 'axios';

let oauthRouter = express.Router();



oauthRouter.get("/redirect", (req, res) => {
    console.log(req.query.state);
    axios({
        method: "POST",
        url: `${process.env.GITHUB_OAUTH_URL}?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&client_secret=${process.env.GITHUB_OAUTH_APPLICATION_TEST_SECRET}&code=${req.query.code}`,
        headers: {
            Accept: "application/json"
        }
    }).then((response) => {
        axios({
            method: "GET",
            url: `https://github.com/user`,
            headers: {
                //"Content-Type": "application/vnd.github+json",
                Authorization: `token ${response.data.access_token}`
            },
            data: {}
        }).then((response) => {
            console.log(response);
        }).catch(err => {
            console.log(err)
        })
        // Get user info, check if user exists
        //  yes -> create session token for user
        //  no -> create user and create session token for user.
        // Create session token based on access token + check for errors + redirect to login page with valid session token.
        res.redirect(`http://localhost:12032/dashboard?access_token=${response.data.access_token}`)
    })
})

oauthRouter.get("/login", (req, res) => {
    let platformUrlMap = {
        "github": `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&redirect_uri=${process.env.OAUTH_REDIRECT_URL}?state=github&scope=read:user`,
    }
    let platform = req.query.platform;
    res.redirect(platformUrlMap[platform]) // Redirect to the oauth provider for the selected platform
})

oauthRouter.post("/signup", (req, res) => {
    // Redirect to overview page with auth providers (we do not support user creation ourselves)
});

oauthRouter.post("/signin", (req, res) => {
    // Redirect to overview page with auth providers (we do not support user creation ourselves)
});

oauthRouter.post("/signout", (req, res) => {

})



export default oauthRouter;