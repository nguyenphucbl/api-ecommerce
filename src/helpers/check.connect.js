"use strict";
const mongoose = require("mongoose");
const os = require("os");
const process = require("process");

const _SECOND = 5000;
// count connection
const countConnect = () => {
  const numConnection = mongoose.connection.readyState;
  console.log(`Number of connections: ${numConnection}`);
};
// check over load connection
const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connection.readyState;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // example maximum connection is 5
    const maxConnection = numCores * 5;
    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
    if (numConnection > maxConnection) {
      console.log(`Overload connection with ${numConnection} connections`);
      //notify to admin
    }
  }, _SECOND); // monitor every 5s
};
module.exports = {
  countConnect,
  checkOverLoad,
};
