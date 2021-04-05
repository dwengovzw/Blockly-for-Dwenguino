import Useritem from '../models/user_model.js';
import RefreshTokenItem from '../models/refreshtoken_model.js';
import ConfirmationCodeItem from '../models/confirmation_code_model.js';
import Validator from '../utils/validator.js';
import sgMail from '@sendgrid/mail';
import emailService from '../utils/email.js';
import cryptoRandomString from 'crypto-random-string';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let exports = {};

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'ThF0yV1sY42aunmy1dUEVwn1ueZn3W67aIfCu9ieRJ9n7KkKWCyfj7MmaiRzawlNSUeSFbfyiUpal7cN4mpaSm8DsI4FFUWmqeP8h1INRtcUMwLokuw7SIvX0LfMGGuzqEnj9cQzABGlXg3Lk0vc5y';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || '7cLkYItoMJHW4cXauNhb2PxeHzcLEPlX1EzIemMFcN54bNeQHkGcWfQhbmLvWJL4BalUxa7KoTIqMf8NVXpC5a5ivAsAXENYWFFyMfJLiJylHqLBEAsSpgQ3C3SvtIwUrqDH896La8DJtJpIIiVwJv';

/**
 * Register a new user and send an email for email verification.
 * @param {*} req | Has to contain the user's email address, password and role.
 * @param {*} res 
 */
exports.register = function(req, res){

  const { 
    firstname,
    email,
    password,
    repeated_password,
    role,
    accept_conditions,
    accept_research 
  } = req.body;

  let errors = Validator.validateUserFields(firstname, email, password, repeated_password, role, accept_conditions, accept_research);
 
  console.log(errors);
  if (errors.length > 0) {
    res.status(401).send(errors);
  } else {
    let db = mongoose.connection;
    db.collection('users').findOne({email: email})
    .then(function(doc) {

      if(!doc){
        bcrypt.genSalt(10,(err,salt) => {
          bcrypt.hash(req.body.password, salt, (err, hashPassword) => {
            if (err) {
              console.debug(err);
              res.status(401).send("Hashing has error.");
            } else {
              let user = new Useritem();
              user.firstname = firstname;
              user.email = email;
              user.password = hashPassword;
              user.role = role;
              user.acceptGeneralConditions = accept_conditions;
              user.acceptResearchConditions = accept_research;
              user.save()
              .then(item => {
                const secretCode = cryptoRandomString({length: 10, type: 'url-safe'});
                const confirmationCode = new ConfirmationCodeItem({
                  email: user.email,
                  code: secretCode
                });
                confirmationCode.save();

                const subject = req.i18n.__("email.confirmationEmailAddress.subject");
                const confirmationUrl = `${process.env.SERVER_URL}auth/verify-account/${user._id}/${secretCode}`;
                let text = req.i18n.__("email.confirmationEmailAddress.text") + confirmationUrl;
                const html = '<p>' 
                  + req.i18n.__("email.confirmationEmailAddress.htmlText") 
                  + '<strong><a href="' 
                  + confirmationUrl 
                  + '" target="_blank">' 
                  + req.i18n.__('email.confirmationEmailAddress.confirmEmail') 
                  + '</a></strong></p>';
                let message = {
                  to: user.email,
                  from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
                  subject: subject,
                  text: text,
                  html: html
                };

                if(process.env.NODE_ENV === 'production'){
                  sgMail.setApiKey(process.env.EMAIL_PASSWORD);
                  sgMail
                    .send(message)
                    .then(() => {}, error => {
                      console.error(error);
                  
                      if (error.response) {
                        console.error(error.response.body)
                      }
                    });
                } else {
                  emailService.sendMail(message);
                }

                res.sendStatus(200);
              })
              .catch(err => {
                console.debug(err);
                res.status(400).send("Unable to register the new user into the database.");
              });
            }
          });
        });
      } else {
        let data = {
          "error": "userAlreadyExists"
        }
        res.status(401).send(data);
      }
    });
  }
}

/**
 * Verify the user's email address by checking the user id with the secret code that the user provides. 
 * Afterwards the user is redirected to the simulator home page.
 * @param {*} req | Has to contain the user id and secret code received by email.
 * @param {*} res 
 */
exports.verifyAccount = function (req, res) {
  let db = mongoose.connection;
  let userId = mongoose.Types.ObjectId(req.params.userId);

  db.collection('users').findOne({_id: userId})
  .then(function(user){
    if(user){
      db.collection('confirmation_codes').findOne({
        email: user.email,
        code: req.params.secretCode})
      .then(function(confirmationCode){
        if(confirmationCode){
          let conditions = { email: user.email };
          let update = { 
            $set :
            {
            status: 'active'
            }
          };
          let options = { multi: false};

          db.collection('users').updateOne(conditions, update, options,
            function(error, numAffected) {
              if(error){
                console.log(error);
                res.redirect(process.env.STATIC_SERVING_URL);
              } else {
                db.collection('confirmation_codes').deleteMany({ email: user.email });
                res.redirect(process.env.STATIC_SERVING_URL);
              }
            } 
          );
        } else {
          console.log('no confirmation code found');
          res.redirect(process.env.STATIC_SERVING_URL);
        }
      });
    } else {
      console.log('no user found');
      res.redirect(process.env.STATIC_SERVING_URL);
    }
  })
}

/**
 * Log the user in and generate an access token and refresh token. 
 * @param {*} req | Has to contain the user's email and password for verification.
 * @param {*} res 
 */
exports.login = function(req, res){
  let db = mongoose.connection;
  const { 
    email,
    password,
  } = req.body;
  let errors = [];

  if (!email || !password) {
    errors.push({msg: "errRequiredFields"});
  }

  if (errors.length > 0) {
    res.status(401).send(errors);
  } else {
    db.collection('users').findOne({email: email})
    .then(function(user){
      if(user){
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            res.status(401).send("The password was not correct or this user does not exist.");
          } else {
            if(result){
              let errors = [];
              if( user.status !== 'active'){
                errors.push("userNotActive");
                let data = {
                  "error": errors
                }
                console.log(data);
                res.status(401).send(data);
              } else {
                const accessToken = jwt.sign({_id: user._id}, ACCESS_TOKEN_SECRET, {expiresIn: '5m'});
                const refreshToken = jwt.sign({_id: user._id}, REFRESH_TOKEN_SECRET);
                db.collection('tokens').findOne({refreshToken: refreshToken})
                .then(function(token) {

                  const cookieConfig = {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production'? true: false,
                    expires: new Date(Date.now() + 3 * 3600000)
                  };
                  const tokens = {
                    accessToken: 'Bearer ' + accessToken, 
                    refreshToken: refreshToken
                  };

                  if(!token){
                    let refreshTokenItem = new RefreshTokenItem();
                    refreshTokenItem.token = refreshToken;
                    refreshTokenItem.email = email;
                    refreshTokenItem.save()
                    .then(item => {
                      res.cookie('dwengo', tokens, cookieConfig);
                      res.sendStatus(200);
                    })
                    .catch(err => {
                      console.debug(err);
                    });
                  } else {
                    res.cookie('dwengo', tokens, cookieConfig);
                    res.sendStatus(200);
                  }
                });
              }
            } else {
              res.status(401).send("Email or password incorrect.");
            } 
          }
        });
      } else {
        res.status(401).send('Email or password incorrect.');
      }
    });
  }
}

exports.resendActivationLink = function(req, res){
  let db = mongoose.connection;
  const { 
    email,
    password,
  } = req.body;
  let errors = [];

  if (!email || !password) {
    errors.push({msg: "errRequiredFields"});
  }

  if (errors.length > 0) {
    res.status(401).send(errors);
  } else {
    db.collection('users').findOne({email: email})
    .then(function(user){
      if(user){
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            res.status(401).send("The password was not correct or this user does not exist.");
          } else {
            let errors = [];
            if( user.status !== 'active'){
              const secretCode = cryptoRandomString({length: 10, type: 'url-safe'});
              const confirmationCode = new ConfirmationCodeItem({
                email: user.email,
                code: secretCode
              });
              confirmationCode.save();

              const subject = req.i18n.__("email.confirmationEmailAddress.subject");
              const confirmationUrl = `${process.env.SERVER_URL}auth/verify-account/${user._id}/${secretCode}`;
              let text = req.i18n.__("email.confirmationEmailAddress.text") + confirmationUrl;
              const html = '<p>' 
                + req.i18n.__("email.confirmationEmailAddress.htmlText") 
                + '<strong><a href="' 
                + confirmationUrl 
                + '" target="_blank">' 
                + req.i18n.__('email.confirmationEmailAddress.confirmEmail') 
                + '</a></strong></p>';
              let message = {
                to: user.email,
                from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
                subject: subject,
                text: text,
                html: html
              };

              if(process.env.NODE_ENV === 'production'){
                sgMail.setApiKey(process.env.EMAIL_PASSWORD);
                sgMail
                  .send(message)
                  .then(() => {}, error => {
                    console.error(error);
                  });
              } else {
                emailService.sendMail(message);
              }
                
              res.sendStatus(200);
            } else {
              errors.push("userAlreadyActive");
              let data = {
                "error": errors
              }
              console.log(data);
              res.status(401).send(data);
            }
          }
        });
      } else {
        res.status(401).send('Email or password incorrect.');
      }
    });
  }
}

/**
 * Send a new access token to the user after verifying the refresh token from the Dwengo cookie.
 * @param {*} req | Has to contain the Dwengo cookie from the user.
 * @param {*} res 
 */
exports.refreshToken = function(req, res){
  let db = mongoose.connection;
  const dwengoCookie = req.cookies.dwengo;
  if(dwengoCookie) {
    const token = dwengoCookie.refreshToken;

    if(!token){
      res.sendStatus(401);
    }

    db.collection('tokens').findOne({token: token})
    .then(function(refreshToken) {
      if(!refreshToken){
        return res.sendStatus(403);
      } else {
        jwt.verify(token, REFRESH_TOKEN_SECRET, (err, decoded) => {
          if (err){
            console.debug(err);
            res.sendStatus(403);
          } else {
            const accessToken = jwt.sign({_id: decoded._id}, ACCESS_TOKEN_SECRET, {expiresIn: '5m'});
            
            const cookieConfig = {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production'? true: false,
              expires: new Date(Date.now() + 3 * 3600000)
            };
            const tokens = {
              accessToken: 'Bearer ' + accessToken, 
              refreshToken: token
            };
            
            res.cookie('dwengo', tokens, cookieConfig);
            res.sendStatus(200);
          }
        });
      }
    });  
  } else {
    res.sendStatus(401);
  }
}

/**
 * Request a new secret code to reset the passsword of a user. The secret code will be send to the user's 
 * email address and is valid for 10 minutes.
 * @param {*} req | Has to contain the user's email address.
 * @param {*} res 
 */
exports.getPasswordResetCode = function (req, res){
  const { email } = req.body;
  let db = mongoose.connection;

  let errors = [];

  console.log(email);

  if(!email){
    errors.push({msg: "errRequiredFields"});
    res.status(401).send(errors);
  } else {
    db.collection('users').findOne({email: email})
    .then(function(user){
      if(user){
        const secretCode = cryptoRandomString({length: 10, type: 'url-safe'});
        const confirmationCode = new ConfirmationCodeItem({
          email: user.email,
          code: secretCode
        });
        confirmationCode.save();

        const subject = req.i18n.__("email.forgetPassword.subject");
        const text = req.i18n.__("email.forgetPassword.text") + `${secretCode}`;
        const html = '<p>' 
          + req.i18n.__("email.confirmationEmailAddress.htmlText") 
          + '<strong>' 
          + `${secretCode}` 
          + '</strong></p>';
        let message = {
          to: user.email,
          from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
          subject: subject,
          text: text,
          html: html
        };

        if(process.env.NODE_ENV === 'production'){
          sgMail.setApiKey(process.env.EMAIL_PASSWORD);
          sgMail
            .send(message)
            .then(() => {}, error => {
              console.error(error);
          
              if (error.response) {
                console.error(error.response.body)
              }
            });
        } else {
          emailService.sendMail(message);
        }

        res.sendStatus(200);
      } else {
        console.log("user not found");
        res.sendStatus(200);
      }
    });
  }
}

/**
 * Verify and save the new password of the user. Verification needs to be handled with a secret key
 * that was sent to the user's email address.
 * @param {*} req | Has to contain the user's email address, the new password and the secret key.
 * @param {*} res 
 */
exports.resetPassword = function (req, res){
  const { email, password, repeated_password, secretCode } = req.body;
  let db = mongoose.connection;

  let errors = [];

  if (!email || !password || !repeated_password || !secretCode) {
    errors.push({ msg: "errRequiredFields" });
  }

  if (errors.length > 0) {
    res.status(401).send(errors);
  } else {
    db.collection('confirmation_codes').findOne({
      email: email,
      code: secretCode})
    .then(function(confirmationCode){
      if(confirmationCode){
        bcrypt.genSalt(10,(err,salt) => {
          bcrypt.hash(req.body.password, salt, (err, hashPassword) => {
            if (err) {
              console.debug(err);
              res.status(401).send("Hashing has error.");
            } else {
              let conditions = { email: email };
              let update = { 
                $set :
                {
                password: hashPassword
                }
              };
              let options = { multi: false};
      
              db.collection('users').updateOne(conditions, update, options,
                function(error, numAffected) {
                  if(error){
                    console.log(error);
                    res.sendStatus(400);
                  } else {
                    db.collection('confirmation_codes').deleteMany({ email: email });
                    res.sendStatus(200);
                  }
                } 
              );
            }
          });
        });
      } else {
        console.log('no confirmation code found');
      }
    });
  }
}

/**
 * Log the user out by verifying the refresh token and deleting it from the database.
 * @param {*} req | contains the Dwengo cookie if the user is logged in.
 * @param {*} res 
 */
exports.logout = function(req, res){
  let db = mongoose.connection;

  const dwengoCookie = req.cookies.dwengo;
  if(dwengoCookie) {
    const refreshToken = dwengoCookie.refreshToken;

    db.collection('tokens').findOne({token: refreshToken})
    .then(function(token) {
      if(!token){
        res.clearCookie("dwengo");
        return res.sendStatus(200);
      } else {
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
          if (err){
            let query = { token: refreshToken };
            db.collection('tokens').deleteMany(query, function(err, obj){
              if (err) {
                res.clearCookie("dwengo");
                console.debug(err);
              } else {
                res.clearCookie("dwengo");
                res.sendStatus(200);
              }
            });
          } else {
            let userId = mongoose.Types.ObjectId(decoded._id);
            db.collection('users').findOne({_id: userId})
            .then(function(user) {
              if(!user){
                let query = { token: refreshToken };
                db.collection('tokens').deleteMany(query, function(err, obj){
                  if (err) {
                    res.clearCookie("dwengo");
                    console.debug(err);
                  } else {
                    res.clearCookie("dwengo");
                    res.sendStatus(200);
                  }
                });
              } else {
                let query = { 
                  token: refreshToken, 
                  email: user.email 
                };
                db.collection('tokens').deleteMany(query, function(err, obj){
                  if (err) {
                    res.clearCookie("dwengo");
                    console.debug(err);
                  } else {
                    res.clearCookie("dwengo");
                    res.sendStatus(200);
                  } 
                });
              }
            });
          }
        });
      } 
    });
  } else {
    res.clearCookie("dwengo");
    res.sendStatus(200);
  }
}

/**
 * Authenticate the user using the accessToken in the Dwengo cookie. 
 * @param {*} req | contains the Dwengo cookie if the user is logged in.
 *                  Additionally it will contain the corresponding user id if the user is authenticate before
 *                  handling the next request.
 * @param {*} res 
 * @param {*} next 
 */
exports.authenticate = function(req, res, next) {
  const dwengoCookie = req.cookies.dwengo;
  if(dwengoCookie) {
    const accessToken = dwengoCookie.accessToken.split(' ')[1];

    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, response) => {
      if(err) {
        console.debug(err);
        return res.sendStatus(403);
      }
      req.user = response;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

/**
 * Authenticate using the accessToken and add the user id to the request for event logging. 
 * If the accessToken is invalid, then silently refresh the token using the refreshToken and 
 * add the user id to the request for event logging.
 * If the user is not authenticated (has no accessToken or refreshToken), then add an empty user id
 * to the request for event logging.
 * 
 * This authentication function should only be used for event logging purposes, not to authenticate
 * other requests. Use 'exports.authenticate' instead.
 * @param {*} req | contains the Dwengo cookie if the user is logged in. 
 *                  Additionally it will contain the corresponding user id if the user is authenticated.
 * @param {*} res
 * @param {*} next 
 */
exports.authenticateForLogging = function(req, res, next) {
  let db = mongoose.connection;
  req.user = {};

  const dwengoCookie = req.cookies.dwengo;
  if(dwengoCookie) {
    const accessToken = dwengoCookie.accessToken.split(' ')[1];

    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, response) => {
      if(err) {
        const refreshToken = dwengoCookie.refreshToken;
        if(!refreshToken){
          req.user._id = '';
          next();
        } else {
          db.collection('tokens').findOne({token: refreshToken})
          .then(function(doc) {
            if(!doc){
              req.user._id = '';
              next();
            } else {
              jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err){
                  console.debug(err);
                  req.user._id = '';
                  next();
                } else {
                  const accessToken = jwt.sign({_id: decoded._id}, ACCESS_TOKEN_SECRET, {expiresIn: '5m'});
                  const cookieConfig = {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production'? true: false,
                    expires: new Date(Date.now() + 3 * 3600000)
                  };
                  const tokens = {
                    accessToken: 'Bearer ' + accessToken, 
                    refreshToken: refreshToken
                  };
                  res.cookie('dwengo', tokens, cookieConfig);
                  let userId = mongoose.Types.ObjectId(decoded._id);
                  db.collection('users').findOne({_id: userId})
                  .then(function(doc) {
                    req.user._id = '';
                    if(doc){
                      req.user._id = doc._id;
                    }
                    next();
                  });
                }
              });
            }
          }); 
        } 
      } else {
        let userId = mongoose.Types.ObjectId(response._id);
        db.collection('users').findOne({_id: userId})
        .then(function(doc) {
          req.user._id = '';
          if(doc){
            req.user._id = doc._id;
          }
          next();
        });
      }
    });
  } else {
    req.user._id = '';
    next();
  }
}

/**
 * Authenticate the user using the accessToken in the Dwengo cookie. 
 * @param {*} req | contains the Dwengo cookie if the user is logged in.
 *                  Additionally it will contain the corresponding user id if the user is authenticate before
 *                  handling the next request.
 * @param {*} res 
 * @param {*} next 
 */
 exports.authenticateAdmin = function(req, res, next) {
  let db = mongoose.connection;

  const dwengoCookie = req.cookies.dwengo;
  if(dwengoCookie) {
    const accessToken = dwengoCookie.accessToken.split(' ')[1];

    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, response) => {
      if(err) {
        console.debug(err);
        return res.sendStatus(403);
      } 

      let id = mongoose.Types.ObjectId(response._id);

      db.collection('users').findOne({_id: id})
      .then(function(user){
          if(user){
            if(user.role == "admin"){
              next();
            } else {
              res.sendStatus(401);
            }
          } else {
              res.sendStatus(401);
          }
      });
    });
  } else {
    res.sendStatus(401);
  }
}

export default exports;