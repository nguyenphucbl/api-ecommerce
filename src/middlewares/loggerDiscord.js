"use strict";
const Logger = require("../loggers/discord.log.v2");
const pushToLogDiscord = async (req, res, next) => {
  try {
    Logger.sendToFormatCode({
      code: req.method === "GET" ? req.query : req.body,
      message: `${req.method} - ${req.originalUrl}`,
      title: `Method: ${req.method} - ${req.originalUrl}`,
    });
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  pushToLogDiscord,
};
