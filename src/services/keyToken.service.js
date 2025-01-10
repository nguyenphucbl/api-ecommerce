"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static async createKeyToken({ userId, publicKey }) {
    try {
      // const publicKeyString = publicKey.toString();
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey,
      });
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  }
}

module.exports = KeyTokenService;
