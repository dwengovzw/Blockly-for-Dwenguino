// State to pass along with the OAuth authorize route
class OAuthState {
    platform;
    originalTarget;
    originalQuery;
    /**
     *
     * @param {*} platform The auth provider we are using
     * @param {*} originalTarget The original page we are redirecting from
     */
    constructor(platform, originalTarget = "/dashboard", originalQuery = "") {
        this.platform = platform;
        this.originalTarget = originalTarget;
        this.originalQuery = originalQuery;
    }
}
export default OAuthState;
//# sourceMappingURL=oauthState.js.map