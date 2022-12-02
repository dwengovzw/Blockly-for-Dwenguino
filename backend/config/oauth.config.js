import db from "../config/db.config.js"

const oauthConfig = {
    authorizeUrlMap: {},
    accessTokenUrlMap: {}
}

oauthConfig.authorizeUrlMap[db.PLATFORMS.github] = ((state, scope=process.env.GITHUB_OAUTH_DEFAULT_SCOPE) => {return `${process.env.GITHUB_OAUTH_AUTHORIZE_URL}?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&redirect_uri=${process.env.OAUTH_REDIRECT_URL}?state=${state}&scope=${scope}`});

oauthConfig.accessTokenUrlMap[db.PLATFORMS.github] = ((code) => {return `${process.env.GITHUB_OAUTH_TOKEN_URL}?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&client_secret=${process.env.GITHUB_OAUTH_APPLICATION_TEST_SECRET}&code=${code}`})

export default oauthConfig;