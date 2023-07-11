/**
 * @jest-environment node
 */

import { describe, expect, it, jest, beforeEach } from '@jest/globals';
//import { mockDatabaseData } from "../../../../backend/utils/add_mock_database_data"
import AbstractOAuthController from '../../../../backend/dist/controllers/abstract.oauth.controller';
import { User } from '../../../../backend/dist/models/user.model';
import jwt from "jsonwebtoken"

const mockPlatform = 'mockPlatform';
  const mockOauthConfig = {
    authorizeUrlMap: {
      mockPlatform: jest.fn().mockReturnValue('mockAuthorizeUrl'),
    },
  };

class MockAbstractOAuthController extends AbstractOAuthController {
  constructor() {
    super('mockPlatform', mockOauthConfig);
  }
}

type reqInterface = {
  session: {
    nonce?: string,
  },
}
type authStateInterface = {
  platform: string,
  nonce?: string,
  originalTarget?: string,
  originalQuery?: string,
}



beforeEach(() => {
    jest.clearAllMocks();
    //mockDatabaseData();
});

describe('AbstractOAuthController', () => {
  describe('constructor', () => {
    it('should not be able to create a new AbstractOAuthController', () => {
      expect(() => new AbstractOAuthController(mockPlatform, mockOauthConfig)).toThrow(TypeError);
      
    });
  });

  describe('login', () => {
    it('should redirect to the OAuth login URL', () => {
      const authState: authStateInterface = {
        platform: mockPlatform,
      };
      const mockReq: reqInterface = {
        session: {},
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        redirect: jest.fn(),
      };
      

      const abstractOAuthController = new MockAbstractOAuthController();
      abstractOAuthController.login(mockReq, mockRes, authState);

      // Assertions
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.send).not.toHaveBeenCalled();
      expect(mockRes.redirect).toHaveBeenCalledWith('mockAuthorizeUrl');
      expect(mockReq.session.nonce).toBeDefined();
      expect(authState.nonce).toBeDefined();
    });

    it('should return an error if the platform name does not match the controller', () => {
      const mockReq = {};
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        redirect: jest.fn(),
      };
      const authState = {
        platform: 'invalidPlatform',
      };

      const abstractOAuthController = new MockAbstractOAuthController();
      abstractOAuthController.login(mockReq, mockRes, authState);

      // Assertions
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({ message: 'Internal server error: platform name does not match controller.' });
      expect(mockRes.redirect).not.toHaveBeenCalled();
    });
  });

  describe('redirect', () => {
    it('should return an error if the platform name does not match the controller', () => {
      const mockReq = {};
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const authState = {
        platform: 'invalidPlatform',
      };

      const abstractOAuthController = new MockAbstractOAuthController();
      abstractOAuthController.redirect(mockReq, mockRes, authState);

      // Assertions
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({ message: 'Internal server error: platform name does not match controller.' });
    });
  });

  describe('logout', () => {
    it('should throw an error indicating that the method is abstract', () => {
      const mockReq = {};
      const mockRes = {};

      const abstractOAuthController = new MockAbstractOAuthController();

      // Assertions
      expect(() => abstractOAuthController.logout(mockReq, mockRes)).toThrowError('This method is abstract');
    });
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const mockReq = {};
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const minUserInfo = {
        getUserId: jest.fn().mockReturnValue('mockUserId'),
        getPlatform: jest.fn().mockReturnValue(mockPlatform),
        getEmail: jest.fn().mockReturnValue('mockEmail'),
        getFirstName: jest.fn().mockReturnValue('mockFirstName'),
        getLastName: jest.fn().mockReturnValue('mockLastName'),
        getRoles: jest.fn().mockReturnValue(['role1', 'role2']),
      };

      jest.spyOn(User.prototype, 'save')
        .mockImplementationOnce(() => Promise.resolve(
          { userId: minUserInfo.getUserId(), 
            platform: minUserInfo.getPlatform(),
            email: minUserInfo.getEmail(),
            firstname: minUserInfo.getFirstName(),
            lastname: minUserInfo.getLastName(),
            roles: minUserInfo.getRoles(),
          }))

      const abstractOAuthController = new MockAbstractOAuthController();
      const newUser = await abstractOAuthController.createUser(mockReq, mockRes, minUserInfo);

      // Assertions
      expect(newUser).toBeDefined();
      expect(newUser.userId).toBe('mockUserId');
      expect(newUser.platform).toBe(mockPlatform);
      expect(newUser.email).toBe('mockEmail');
      expect(newUser.firstname).toBe('mockFirstName');
      expect(newUser.lastname).toBe('mockLastName');
      expect(newUser.roles).toStrictEqual(['role1', 'role2']);
    });
  });

  describe('signin', () => {
    const mockReq = {
      session: {},
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      redirect: jest.fn(),
    };
    const mockMinUserInfo: any = {
      getUserId: jest.fn().mockReturnValue('mockUserId'),
      getPlatform: jest.fn().mockReturnValue('mockPlatform'),
      getEmail: jest.fn().mockReturnValue('mockEmail'),
      getFirstName: jest.fn().mockReturnValue('mockFirstName'),
      getLastName: jest.fn().mockReturnValue('mockLastName'),
      getRoles: jest.fn().mockReturnValue(['role1', 'role2']),
    };
    const mockAuthState: any = {
      platform: 'mockPlatform',
      originalTarget: 'mockTarget',
      originalQuery: 'mockQuery',
    };
    // Mock user save
    jest.spyOn(User.prototype, 'save')
        .mockImplementationOnce(() => Promise.resolve(
          { userId: mockMinUserInfo.getUserId(), 
            platform: mockMinUserInfo.getPlatform(),
            email: mockMinUserInfo.getEmail(),
            firstname: mockMinUserInfo.getFirstName(),
            lastname: mockMinUserInfo.getLastName(),
            roles: mockMinUserInfo.getRoles(),
          }))
    const user = { userId: 'mockUserId', platform: 'mockPlatform', acceptedTerms: true };
    const userNoAccept = { userId: 'mockUserId', platform: 'mockPlatform', acceptedTerms: false };
    const mockCreateUser = jest.fn().mockReturnValue(user);
    const mockCreateUserFail = jest.fn().mockReturnValue(null);
    const abstractOAuthController = new MockAbstractOAuthController();

    it('should create a new user if the user does not exist', async () => {
      // @ts-ignore
      abstractOAuthController.createUser = mockCreateUser; 

      // Mock findOne on User model
      // @ts-ignore
      jest.spyOn(User, 'findOne').mockImplementationOnce((filter) => {
          return {
            exec: jest.fn().mockImplementationOnce((callback: any) => {
              callback(null, null); // User does not exist
            })
          }
        });

      await abstractOAuthController.signin(mockReq, mockRes, mockMinUserInfo, mockAuthState);

      // Assertions
      expect(mockCreateUser).toHaveBeenCalledWith(mockReq, mockRes, mockMinUserInfo);
    });

    it('should not create a new user if the user exists', async () => {
      // @ts-ignore
      abstractOAuthController.createUser = mockCreateUser; 

      // Mock findOne on User model
      // @ts-ignore
      jest.spyOn(User, 'findOne').mockImplementationOnce((filter) => {
          return {
            exec: jest.fn().mockImplementationOnce((callback: any) => {
              callback(null, user); // User does exist
            })
          }
        });

      await abstractOAuthController.signin(mockReq, mockRes, mockMinUserInfo, mockAuthState);

      // Assertions
      expect(mockCreateUser).not.toHaveBeenCalled();
    });

    
    it('should send an error response if an error occurs during user lookup', async () => {
      // @ts-ignore
      abstractOAuthController.createUser = mockCreateUser; 
      const mockErrorMessage = "Error!!!"
      // Mock findOne on User model
      // @ts-ignore
      jest.spyOn(User, 'findOne').mockImplementationOnce((filter) => {
          return {
            exec: jest.fn().mockImplementationOnce((callback: any) => {
              callback(mockErrorMessage, null); // Error occurred during lookup
            })
          }
        });

      await abstractOAuthController.signin(mockReq, mockRes, mockMinUserInfo, mockAuthState);

      // Assertions
      expect(mockCreateUser).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({ message: mockErrorMessage });
    });

    it('should send an error response if unable to create user', async () => {
      // @ts-ignore
      abstractOAuthController.createUser = mockCreateUserFail; 

      // Mock findOne on User model
      // @ts-ignore
      jest.spyOn(User, 'findOne').mockImplementationOnce((filter) => {
          return {
            exec: jest.fn().mockImplementationOnce((callback: any) => {
              callback(null, null); // User does not exist
            })
          }
        });

      await abstractOAuthController.signin(mockReq, mockRes, mockMinUserInfo, mockAuthState);

      // Assertions
      expect(mockCreateUserFail).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({ message: 'Unable to create user' });
    });


    it('should set the token in the session and redirect to the original target if user accepts terms', async () => {
      const authState: authStateInterface = {
        platform: mockPlatform,
        originalTarget: 'mockTarget',
        originalQuery: 'mockQuery',
      };
      testAcceptRedirectTest(user, `${process.env.SERVER_URL}${authState.originalTarget}?${authState.originalQuery}`)
    });


    it('should set the token in the session and redirect to the dashboard if user has not accepted terms', async () => {
      testAcceptRedirectTest(userNoAccept, `${process.env.SERVER_URL}/dashboard`);
    });

    let testAcceptRedirectTest = async (mockedUser: any, redirect: string) => {
      const authState: authStateInterface = {
        platform: mockPlatform,
        originalTarget: 'mockTarget',
        originalQuery: 'mockQuery',
      };
      const mockJwtSign = jest.fn().mockReturnValue('mockToken');
      const abstractOAuthController = new MockAbstractOAuthController();
      // @ts-ignore
      abstractOAuthController.createUser = mockCreateUser;
      // @ts-ignore
      jest.spyOn(User, 'findOne').mockImplementationOnce((filter) => {
        return {
          exec: jest.fn().mockImplementationOnce((callback: any) => {
            callback(null, mockedUser); // User does exist
          })
        }
      });
      jest.spyOn(jwt, 'sign').mockImplementation(mockJwtSign);

      await abstractOAuthController.signin(mockReq, mockRes, mockMinUserInfo, mockAuthState);

      // Assertions
      // @ts-ignore
      expect(mockReq.session.token).toBe('mockToken');
      expect(mockRes.redirect).toHaveBeenCalledWith(redirect);
      // Add assertions for other expected behavior
    }
  });

});