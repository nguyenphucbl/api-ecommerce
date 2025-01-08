"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const connectString = "mongodb://localhost:27017/shop_dev";

class Database {
  constructor() {
    this.connect();
  }
  //connect
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) =>
        console.log("Connect to database successfully!", countConnect())
      )
      .catch((error) => console.log("Error connecting to database", error));
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;