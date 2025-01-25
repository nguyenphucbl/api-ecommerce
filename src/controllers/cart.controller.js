"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  async addToCart(req, res, next) {
    new SuccessResponse({
      message: "add to cart successfully",
      metadata: await CartService.addToCart({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  }
  async updateCart(req, res, next) {
    new SuccessResponse({
      message: "Update cart successfully",
      metadata: await CartService.addToCartV2({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  }
  async deleteCart(req, res, next) {
    new SuccessResponse({
      message: "Delete cart successfully",
      metadata: await CartService.deleteProductFromUserCart({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  }
  async getCart(req, res, next) {
    new SuccessResponse({
      message: "Get cart successfully",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  }
}

module.exports = new CartController();
