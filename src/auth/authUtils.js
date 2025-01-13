"use strict";
const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //access token
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    //verify
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("err", err);
      } else {
        console.log("decode", decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};
const authentication = asyncHandler(async (req, res, next) => {
  //1. check userId existing
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");
  //2. get access token
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found user");
  //3. check access token
  const accessToken = req.headers[HEADER.AUTHORIZATION].split(" ")[1];

  if (!accessToken) throw new AuthFailureError("Invalid Request");
  try {
    const decode = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decode.userId) throw new AuthFailureError("Invalid User");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});
const verifyJWT = async (token, keySecret) => {
  return JWT.verify(token, keySecret);
};
module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
