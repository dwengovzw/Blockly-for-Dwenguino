/**
 * @jest-environment node
 */

import db from '../../../../backend/dist/config/db.config';
import { OAuthController } from '../../../../backend/dist/controllers/oauth.controller';
import OAuthState from '../../../../backend/dist/datatypes/oauthState';
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';


let mockOAuthController = {
    login: jest.fn(),
    redirect: jest.fn(),
    logout: jest.fn()
};
let mockReq = {
    query: {
        platform: "test",
        originalRequestInfo: '{"originalTarget": "target", "originalQuery": "query"}',
        state: ""
    },
    platform: "",
    session: {
        token: ""
    }
};
let mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn()
};

beforeEach(() => {
    jest.clearAllMocks();
});


describe('OAuthController', () => {
    it('should call the login function of the respective OAuth provider', () => {
        mockReq.query.platform = "github";
        const oauthController = new OAuthController({"github": mockOAuthController});
        oauthController.login(mockReq, mockRes);

        // Assertions
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.send).not.toHaveBeenCalled();
        expect(mockOAuthController.login)
        .toHaveBeenCalledWith(
            mockReq, 
            mockRes, 
            new OAuthState("github", "target", "query")
        );
    });

    it('should send 401 error: Selected platform not supported', () => {
        mockReq.query.platform = "unsupportedPlatform";
        const oauthController = new OAuthController({"test": mockOAuthController});
        oauthController.login(mockReq, mockRes);

        // Assertions
        expect(mockOAuthController.login).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.send).toHaveBeenCalledWith({ message: "Selected platform not supported!" });
    });

    it('redirect should send an error response if the OAuth platform is unknown', () => {
        mockReq.query.platform = "unsupportedPlatform";
        const oauthController = new OAuthController({"test": mockOAuthController});
        oauthController.redirect(mockReq, mockRes);

        // Assertions
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.send).toHaveBeenCalledWith({ message: "Authentication failed! Unknown OAuth platform" });
    });

    it('should call redirect on controller for platform when platform exists', () => {
        mockReq.query.state = '{"platform": "github"}';
        const oauthController = new OAuthController({"github": mockOAuthController});
        oauthController.redirect(mockReq, mockRes);

        // Assertions
        expect(mockOAuthController.redirect).toHaveBeenCalled();
    });

    it('redirect should call redirect on mockOAuthController with correct state.', () => {
        mockReq.query.platform = "github";
        mockReq.query.state = '{"platform": "github"}';
        const oauthController = new OAuthController({"github": mockOAuthController});
        oauthController.redirect(mockReq, mockRes);

        // Assertions
        expect(mockOAuthController.redirect).toHaveBeenCalledWith(
            mockReq,
            mockRes,
            JSON.parse(mockReq.query.state)
        );
    });

    it('redirect should send error status 401 (empty) state.', () => {
        mockReq.query.platform = "test";
        mockReq.query.state = '';
        const oauthController = new OAuthController({"test": mockOAuthController});
        oauthController.redirect(mockReq, mockRes);

        // Assertions
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.send).toHaveBeenCalledWith({ message: "Authentication failed! Unknown OAuth platform" });
    });

    it('redirect should send error status 401 (undefined) state.', () => {
        mockReq.query.platform = "test";
        let {state, ...restReq} = mockReq.query;
        const oauthController = new OAuthController({"test": mockOAuthController});
        oauthController.redirect(restReq, mockRes);

        // Assertions
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.send).toHaveBeenCalledWith({ message: "Authentication failed! Unknown OAuth platform" });
    });

    

    it('should reset the session token and call the logout function of the respective OAuth provider', () => {
        mockReq.session.token = "token";
        mockReq.platform = "test";
        const oauthController = new OAuthController({"test": mockOAuthController});
        oauthController.logout(mockReq, mockRes);

        // Add assertions for resetting the session token and calling the logout function of the respective OAuth provider
        expect(mockReq.session.token).toBeNull()
        expect(mockOAuthController.logout).toHaveBeenCalledTimes(1)

    });

    it('should respond with the supported platforms', () => {
        const oauthController = new OAuthController({"test": mockOAuthController});
        oauthController.getPlatforms(mockReq, mockRes);
    
        // Assertions
        expect(mockRes.json).toHaveBeenCalledWith(db.PLATFORMS);
      });
});
