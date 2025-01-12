const express = require("express");
const AccessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const router = express.Router();

//signup
router.post("/shop/signup", asyncHandler(AccessController.singUp));
router.post("/shop/login", asyncHandler(AccessController.login));
module.exports = router;
