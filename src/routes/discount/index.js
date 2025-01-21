"use strict";

const express = require("express");
const DiscountController = require("../../controllers/discount.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.use(authenticationV2);
router.post("/amount", asyncHandler(DiscountController.getDiscountAmount));
router.get(
  "/list-product-code",
  asyncHandler(DiscountController.getAllDiscountCodesWithProduct)
);
router.post("", asyncHandler(DiscountController.createProduct));
router.get("", asyncHandler(DiscountController.getAllDiscountCodes));
module.exports = router;
