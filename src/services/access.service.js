"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static async signUp({ name, email, password }) {
    try {
      const existedEmail = await shopModel.findOne({ email }).lean();
      if (existedEmail) {
        return {
          code: "xxxx",
          message: "Email already exist",
          status: "error",
        };
      }
      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });
      if (newShop) {
        // created privateKey, publicKey version complex
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        //version simple
        // const privateKey = crypto.getRandomValues(64).toString("hex");
        // const publicKey = crypto.getRandomValues(64).toString("hex");
        console.log({
          privateKey,
          publicKey,
        }); //save collection KeyStore
        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });
        console.log(`publicKeyString`, publicKeyString);
        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "Create publicKey failed",
            status: "error",
          };
        }
        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        console.log(
          "🚀 ~ AccessService ~ signUp ~ publicKeyObject:",
          publicKeyObject
        );

        // create token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyString,
          privateKey
        );
        console.log(`createTokenPair`, tokens);
        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              field: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };

        //const tokens = await
      }
      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  }
}

module.exports = AccessService;
