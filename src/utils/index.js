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
// [a,b] => {a:1,b:1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((key) => [key, 1]));
};
const unSelectData = (select = []) => {
  return Object.fromEntries(select.map((key) => [key, 0]));
};
module.exports = {
  getInfoData,
  createKeyPair,
  getSelectData,
  unSelectData,
};
