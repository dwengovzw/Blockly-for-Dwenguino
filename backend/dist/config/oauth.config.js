import db from "./db.config.js";
const oauthConfig = {
    authorizeUrlMap: {},
    accessTokenUrlMap: {}
};
oauthConfig.authorizeUrlMap[db.PLATFORMS.github] = ((state, nonce, scope = process.env.GITHUB_OAUTH_DEFAULT_SCOPE) => { return `${process.env.GITHUB_OAUTH_AUTHORIZE_URL}?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.OAUTH_REDIRECT_URL)}&state=${state}&scope=${scope}`; });
oauthConfig.authorizeUrlMap[db.PLATFORMS.leerId] = ((state, nonce, scope = process.env.LEERID_OAUTH_DEFAULT_SCOPE) => { return `${process.env.LEERID_OAUTH_AUTHORIZE_URL}?client_id=${process.env.LEERID_OAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.OAUTH_REDIRECT_URL)}&state=${state}&scope="${encodeURIComponent(scope)}"&response_type=${process.env.LEERID_OAUTH_RESPONSE_TYPES}&nonce=${nonce}`; });
oauthConfig.accessTokenUrlMap[db.PLATFORMS.github] = ((code) => { return `${process.env.GITHUB_OAUTH_TOKEN_URL}?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&client_secret=${process.env.GITHUB_OAUTH_APPLICATION_TEST_SECRET}&code=${code}`; });
oauthConfig.accessTokenUrlMap[db.PLATFORMS.leerId] = ((code) => { return `${process.env.LEERID_OAUTH_TOKEN_URL}?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&client_secret=${process.env.GITHUB_OAUTH_APPLICATION_TEST_SECRET}&code=${code}`; });
export default oauthConfig;
//# sourceMappingURL=oauth.config.js.map