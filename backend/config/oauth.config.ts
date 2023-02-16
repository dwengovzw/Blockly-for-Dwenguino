import db from "./db.config.js"
import crypto from "crypto"

const oauthConfig = {
    authorizeUrlMap: {},
    accessTokenUrlMap: {},
    queryStringMap: {}, 
    logoutUrlMap: {}
}

oauthConfig.authorizeUrlMap[db.PLATFORMS.github] = ((state, scope=process.env.GITHUB_OAUTH_DEFAULT_SCOPE) => {return `${process.env.GITHUB_OAUTH_AUTHORIZE_URL}?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.OAUTH_REDIRECT_URL)}&state=${state}&scope=${scope}`});
oauthConfig.authorizeUrlMap[db.PLATFORMS.leerId] = ((state, scope=process.env.LEERID_OAUTH_DEFAULT_SCOPE) => {return `${process.env.LEERID_OAUTH_AUTHORIZE_URL}?client_id=${process.env.LEERID_OAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.OAUTH_REDIRECT_URL)}&state=${state}&scope=${encodeURIComponent(scope)}&response_type=${process.env.LEERID_OAUTH_RESPONSE_TYPES}`});
oauthConfig.authorizeUrlMap[db.PLATFORMS.beACM] = ((state, scope=process.env.ACM_OAUTH_DEFAULT_SCOPE) => {return `${process.env.ACM_OAUTH_AUTHORIZE_URL}?client_id=${process.env.ACM_OAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.OAUTH_REDIRECT_URL)}&state=${state}&scope=${encodeURIComponent(scope)}&response_type=${process.env.ACM_OAUTH_RESPONSE_TYPES}`});

oauthConfig.accessTokenUrlMap[db.PLATFORMS.github] = ((code) => {return `${process.env.GITHUB_OAUTH_TOKEN_URL}?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&client_secret=${process.env.GITHUB_OAUTH_APPLICATION_TEST_SECRET}&code=${code}`})
oauthConfig.accessTokenUrlMap[db.PLATFORMS.leerId] = ((code) => {return `${process.env.LEERID_OAUTH_TOKEN_URL}`})
oauthConfig.accessTokenUrlMap[db.PLATFORMS.beACM] = ((code) => {return `${process.env.ACM_OAUTH_TOKEN_URL}`})

oauthConfig.queryStringMap[db.PLATFORMS.leerId] = (code => { 
    return `client_id=${process.env.LEERID_OAUTH_CLIENT_ID}&client_secret=${process.env.LEERID_OAUTH_APPLICATION_TEST_SECRET}&code=${code}&grant_type=${encodeURIComponent("authorization_code")}&redirect_uri=${encodeURIComponent(process.env.OAUTH_REDIRECT_URL)}`
})
oauthConfig.queryStringMap[db.PLATFORMS.beACM] = (code => { 
    return `client_id=${process.env.ACM_OAUTH_CLIENT_ID}&client_secret=${process.env.ACM_OAUTH_APPLICATION_TEST_SECRET}&code=${code}&grant_type=${encodeURIComponent("authorization_code")}&redirect_uri=${encodeURIComponent(process.env.OAUTH_REDIRECT_URL)}`
})

oauthConfig.logoutUrlMap[db.PLATFORMS.github] = `${process.env.GITHUB_OAUTH_LOGOUT_URL}?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&post_logout_redirect_uri=${encodeURIComponent(process.env.OAUTH_POST_LOGOUT_REDIRECT)}`
oauthConfig.logoutUrlMap[db.PLATFORMS.leerId] = `${process.env.LEERID_OAUTH_LOGOUT_URL}?client_id=${process.env.LEERID_OAUTH_CLIENT_ID}&post_logout_redirect_uri=${encodeURIComponent(process.env.OAUTH_POST_LOGOUT_REDIRECT)}`
oauthConfig.logoutUrlMap[db.PLATFORMS.beACM] = `${process.env.ACM_OAUTH_LOGOUT_URL}?client_id=${process.env.ACM_OAUTH_CLIENT_ID}&post_logout_redirect_uri=${encodeURIComponent(process.env.OAUTH_POST_LOGOUT_REDIRECT)}`

export default oauthConfig;