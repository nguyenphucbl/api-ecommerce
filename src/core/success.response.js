"use strict";
const { ReasonPhrases, StatusCodes } = require("../utils/httpStatusCode");
class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonPhrase = ReasonPhrases.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonPhrase : message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }
  send(res, headers = {}) {
    return res.status(this.statusCode).json(this);
  }
}
class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}
class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonPhrase = ReasonPhrases.CREATED,
    metadata,
    options = {},
  }) {
    super({ message, statusCode, reasonPhrase, metadata });
    this.options = options;
  }
}

module.exports = {
  OK,
  CREATED,
  SuccessResponse,
};
