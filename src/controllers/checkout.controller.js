"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
  async checkoutReview(req, res, next) {
    new SuccessResponse({
      message: "add to cart successfully",
      metadata: await CheckoutService.checkoutReview({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  }
}

module.exports = new CheckoutController();
