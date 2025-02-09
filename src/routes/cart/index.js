"use strict";

const express = require("express");

const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const CartController = require("../../controllers/cart.controller");
const router = express.Router();

router.use(authenticationV2);
router.post("/", asyncHandler(CartController.addToCart));
router.post("/update", asyncHandler(CartController.updateCart));
router.delete("/", asyncHandler(CartController.deleteCart));
router.get("/", asyncHandler(CartController.getCart));

module.exports = router;
