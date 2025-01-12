"use strict";

const pick = require("lodash/pick");
const crypto = require("crypto");
const getInfoData = ({ field = [], object = {} }) => {
  return pick(object, field);
};
const createKeyPair = () => {
  const privateKey = crypto.randomBytes(64).toString("hex");
  const publicKey = crypto.randomBytes(64).toString("hex");
  return { privateKey, publicKey };
};
module.exports = {
  getInfoData,
  createKeyPair,
};
