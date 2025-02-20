"use strict";

const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData, createKeyPair } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const shopModel = require("../models/shop.model");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static async handleRefreshToken({ refreshToken, user, keyStore }) {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError(
        "Error: Something went wrong! Please login again"
      );
    }
    if (keyStore.refreshToken !== refreshToken) {
      throw new ForbiddenError("Error: Invalid token");
    }
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new AuthFailureError("Error: Email not found");
    }

    // create new token pair
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );
    // update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // add token used
      },
    });
    return {
      user,
      tokens,
    };
  }
  static async logout(keyStore) {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log("🚀 ~ AccessService ~ logout ~ delKey:", delKey);
    return delKey;
  }
  static async login({ email, password, refreshToken = null }) {
    //1. check email
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Error: Email not found");
    }
    //2. check password
    const passwordMatch = await bcrypt.compare(password, foundShop.password);
    if (!passwordMatch) {
      throw new AuthFailureError("Error: Authentication failed");
    }
    //3. create key pair
    const { publicKey, privateKey } = createKeyPair();
    //. save key pair

    //4 generate token pair
    const tokens = await createTokenPair(
      {
        userId: foundShop._id,
        email,
      },
      publicKey,
      privateKey
    );
    const keyStore = await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    if (!keyStore) {
      throw new BadRequestError("Error: failed to create key store");
    }
    return {
      shop: getInfoData({
        field: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  }
  static async signUp({ name, email, password }) {
    const existedEmail = await findByEmail({ email });
    if (existedEmail) {
      throw new BadRequestError("Error: Email already exists");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      //version simple
      const { publicKey, privateKey } = createKeyPair();
      //save collection KeyStore
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        throw new BadRequestError("Error: KeyStore not create");
      }

      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      return {
        shop: getInfoData({
          field: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };

      //const tokens = await
    }
    return null;
  }
}

module.exports = AccessService;
