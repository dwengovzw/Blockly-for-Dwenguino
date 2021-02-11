import Useritem from '../models/user_model.js';
import RefreshTokenItem from '../models/refreshtoken_model.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let exports = {};

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'ThF0yV1sY42aunmy1dUEVwn1ueZn3W67aIfCu9ieRJ9n7KkKWCyfj7MmaiRzawlNSUeSFbfyiUpal7cN4mpaSm8DsI4FFUWmqeP8h1INRtcUMwLokuw7SIvX0LfMGGuzqEnj9cQzABGlXg3Lk0vc5y';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || '7cLkYItoMJHW4cXauNhb2PxeHzcLEPlX1EzIemMFcN54bNeQHkGcWfQhbmLvWJL4BalUxa7KoTIqMf8NVXpC5a5ivAsAXENYWFFyMfJLiJylHqLBEAsSpgQ3C3SvtIwUrqDH896La8DJtJpIIiVwJv';

/**
 * 
 * @param {*} req | Containting username and password.
 * @param {*} res 
 */
exports.register = function(req, res){
  let db = mongoose.connection;
  db.collection('users').findOne({username: req.body.username})
  .then(function(doc) {

      if(!doc){
        bcrypt.genSalt(10,(err,salt) => {
          bcrypt.hash(req.body.password, salt, (err, hashPassword) => {
            if (err) {
              console.debug(err);
              res.status(401).send("Hashing has error.");
            } else {
              bcrypt.hash(req.body.username, salt, (err, hashUsername) => {
                if (err) {
                  console.debug(err);
                  res.status(401).send("Hashing has error.");
                } else {
                  let user = new Useritem();
                  user.username = req.body.username;
                  user.id = hashUsername;
                  user.password = hashPassword;
                  user.email = req.body.email;
                  user.date_of_birth = null;
                  user.school = null;
                  user.gender = null;
                  user.language = null;
                  user.save()
                  .then(item => {
                    const accessToken = jwt.sign({username: user.username}, ACCESS_TOKEN_SECRET, {expiresIn: '5m'});
                    const refreshToken = jwt.sign({username: user.username}, REFRESH_TOKEN_SECRET, {expiresIn:'180m'});
                    
                    const cookieConfig = {
                      httpOnly: true,
                      secure: process.env.NODE_ENV === 'production'? true: false,
                      expires: new Date(Date.now() + 3 * 3600000)
                    };
                    const tokens = {
                      accessToken: 'Bearer ' + accessToken, 
                      refreshToken: refreshToken
                    };

                    db.collection('tokens').findOne({refreshToken: refreshToken})
                    .then(function(doc) {
                      if(!doc){
                        let refreshTokenItem = new RefreshTokenItem();
                        refreshTokenItem.token = refreshToken;
                        refreshTokenItem.username = user.username;
                        refreshTokenItem.save()
                        .then(item => {
                          res.cookie('dwengo', tokens, cookieConfig);
                          res.send({ 
                            username: user.username,
                            user: user.id, 
                          });
                        })
                        .catch(err => {
                          console.debug(err);
                        });
                      } else {
                        res.cookie('dwengo', tokens, cookieConfig);
                        res.send({ 
                          username: user.username,
                          user: user.id, 
                        });
                      }
                    });
                  })
                  .catch(err => {
                    console.debug(err);
                    res.status(400).send("Unable to register the new user into the database.");
                  });
                }
              });
            }
          });
        });
      } else {
        res.status(401).send("The username does already exist. Try a different one");
      }
  });
}

exports.login = function(req, res){
  let db = mongoose.connection;
  db.collection('users').findOne({username: req.body.username})
  .then(function(doc){
    if(doc){
      bcrypt.compare(req.body.password, doc.password, (err, result) => {
        if (err) {
          res.status(401).send("The password was not correct or this user does not exist.");
        } else {
          if(result){
            const accessToken = jwt.sign({username: doc.username}, ACCESS_TOKEN_SECRET, {expiresIn: '5m'});
            const refreshToken = jwt.sign({username: doc.username}, REFRESH_TOKEN_SECRET);
            db.collection('tokens').findOne({refreshToken: refreshToken})
            .then(function(doc) {

              const cookieConfig = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'? true: false,
                expires: new Date(Date.now() + 3 * 3600000)
              };
              const tokens = {
                accessToken: 'Bearer ' + accessToken, 
                refreshToken: refreshToken
              };

              if(!doc){
                let refreshTokenItem = new RefreshTokenItem();
                refreshTokenItem.token = refreshToken;
                refreshTokenItem.username = req.body.username;
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
          } else {
            res.status(401).send("Username or password incorrect.");
          } 
        }
      });
    } else {
      res.status(401).send('Username or password incorrect.');
    }
  });
}

exports.refreshToken = function(req, res){
  let db = mongoose.connection;
  const dwengoCookie = req.cookies.dwengo;
  if(dwengoCookie) {
    const token = dwengoCookie.refreshToken;

    if(!token){
      res.sendStatus(401);
    }

    db.collection('tokens').findOne({token: token})
    .then(function(doc) {
      if(!doc){
        return res.sendStatus(403);
      } else {
        jwt.verify(token, REFRESH_TOKEN_SECRET, (err, decoded) => {
          if (err){
            console.debug(err);
            res.sendStatus(403);
          } else {
            const accessToken = jwt.sign({username: decoded.username}, ACCESS_TOKEN_SECRET, {expiresIn: '5m'});
            
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

exports.logout = function(req, res){
  let db = mongoose.connection;
  const refreshToken = req.body.refreshToken;
  const username = req.body.username;

  let query = { token: refreshToken, username: username };

  db.collection('users').findOne({username: username})
  .then(function(doc){
    if(doc){
      db.collection('tokens').deleteOne(query, function(err, obj){
        if (err) {
          console.debug(err);
        } else {
          res.send("Logout successful");
        }
      });
    } else {
      res.send("Logout unsuccessful");
    }
  });
}

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
 * @param {*} req 
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
          req.user.id = '';
          next();
        } else {
          db.collection('tokens').findOne({token: refreshToken})
          .then(function(doc) {
            if(!doc){
              req.user.id = '';
              next();
            } else {
              jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err){
                  console.debug(err);
                  req.user.id = '';
                  next();
                } else {
                  const accessToken = jwt.sign({username: decoded.username}, ACCESS_TOKEN_SECRET, {expiresIn: '5m'});
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
                  db.collection('users').findOne({username: decoded.username})
                  .then(function(doc) {
                    req.user.id = '';
                    if(doc){
                      req.user.id = doc.id;
                    }
                    next();
                  });
                }
              });
            }
          }); 
        } 
      } else {
        db.collection('users').findOne({username: response.username})
        .then(function(doc) {
          req.user.id = '';
          if(doc){
            req.user.id = doc.id;
          }
          next();
        });
      }
    });
  } else {
    req.user.id = '';
    next();
  }
}

export default exports;