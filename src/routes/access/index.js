const express = require("express");
const AccessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const validate = require("../../middlewares/validate");
const UserValidator = require("../../validators/user.validator");
const router = express.Router();

//signup
router.post(
  "/shop/signup",
  validate(UserValidator.register()),
  asyncHandler(AccessController.singUp)
);
router.post(
  "/shop/login",
  validate(UserValidator.login()),
  asyncHandler(AccessController.login)
);
// authentication
router.use(authenticationV2);
router.post("/shop/logout", asyncHandler(AccessController.logout));
router.post(
  "/shop/refresh-token",
  asyncHandler(AccessController.handleRefreshToken)
);
module.exports = router;
