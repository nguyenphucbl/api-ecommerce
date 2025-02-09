"use strict";

const pick = require("lodash/pick");
const crypto = require("crypto");
const { Types } = require("mongoose");
const convertToObjectId = (id) => {
  return new Types.ObjectId(id);
};
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
const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== null && typeof obj[key] === "object")
      removeUndefinedObject(obj[key]);
    if (obj[key] === null || obj[key] === undefined) delete obj[key];
  });
  return obj;
};
const updateNestedObject = (obj) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (
      typeof obj[key] === "object" &&
      !Array.isArray(obj[key]) &&
      obj[key] !== null
    ) {
      const response = updateNestedObject(obj[key]);
      Object.keys(response).forEach((k) => {
        final[`${key}.${k}`] = response[k];
      });
    } else {
      final[key] = obj[key];
    }
  });

  return final;
};

module.exports = {
  getInfoData,
  createKeyPair,
  getSelectData,
  unSelectData,
  removeUndefinedObject,
  updateNestedObject,
  convertToObjectId,
};
