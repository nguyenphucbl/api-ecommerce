const joi = require("joi");

class UserValidator {
  static login() {
    return {
      body: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
      }),
    };
  }
  static register() {
    return {
      body: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
        name: joi.string().min(3).max(30).required(),
      }),
    };
  }
}

module.exports = UserValidator;
