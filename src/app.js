const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");

// const db = require("./dbs/init.mongodb.lv0");
const app = express();
dotenv.config();
// init middleware
app.use(morgan("dev"));
app.use(helmet()); // bảo mật ứng dụng
app.use(compression()); // nén dữ liệu trước khi gửi đi
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// init db
// db.connect();
require("./dbs/init.mongodb");
// const { checkOverLoad } = require("./helpers/check.connect");
// checkOverLoad();
// init routes
app.use("/", require("./routes"));
// handle errors

module.exports = app;
