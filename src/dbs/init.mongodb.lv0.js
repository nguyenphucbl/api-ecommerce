"use strict";

const mongoose = require("mongoose");
const connectString = "mongodb://localhost:27017/shop_dev";

async function connect() {
  try {
    await mongoose.connect(connectString);
    console.log("Connect to database successfully!");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
}
//dev
if (1 === 0) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = { connect };
