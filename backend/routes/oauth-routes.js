import express from 'express';
import axios from 'axios';

let oauthRouter = express.Router();

const CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_OAUTH_APPLICATION_TEST_SECRET;
const GITHUB_URL = process.env.GITHUB_OAUTH_URL;

oauthRouter.get("/redirect", (req, res) => {
    axios({
        method: "POST",
        url: `${GITHUB_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`,
        headers: {
            Accept: "application/json"
        }
    }).then((response) => {
        res.redirect(`https://blockly.dwengo.org?access_token=${response.data.access_token}`)
    })
})


export default oauthRouter;