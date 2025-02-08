"use strict";

const { BadRequestError } = require("../core/error.response");

const validate = (schema) => (req, res, next) => {
  if (schema.body) {
    const { error } = schema.body.validate(req.body, { abortEarly: false });
    if (error) throw new BadRequestError(error.message);
  }
  if (schema.query) {
    const { error } = schema.query.validate(req.query, { abortEarly: false });
    if (error) throw new BadRequestError(error.message);
  }
  next();
};

module.exports = validate;
