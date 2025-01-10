"use strict";

const pick = require("lodash/pick");
const getInfoData = ({ field = [], object = {} }) => {
  return pick(object, field);
};

module.exports = {
  getInfoData,
};
