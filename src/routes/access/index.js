const express = require("express");
const AccessController = require("../../controllers/access.controller");
const router = express.Router();

//signup
router.post("/shop/signup", AccessController.singUp);

module.exports = router;
