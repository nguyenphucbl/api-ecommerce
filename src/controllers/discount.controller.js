"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  async createDiscount(req, res, next) {
    new CREATED({
      message: "Create new discount successfully",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  }
  async updateDiscount(req, res, next) {
    new CREATED({
      message: "Create new discount successfully",
      metadata: await DiscountService.updateDiscountCode(
        req.params.discountId,
        payload
      ),
    }).send(res);
  }
  async getAllDiscountCodes(req, res, next) {
    new SuccessResponse({
      message: "Get all discounts successfully",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  }
  async getDiscountAmount(req, res, next) {
    new SuccessResponse({
      message: "Get discount amount successfully",
      metadata: await DiscountService.getDiscountAmount({
        shopId: req.user.userId,
        ...req.body,
      }),
    }).send(res);
  }
  async getAllDiscountCodesWithProduct(req, res, next) {
    new SuccessResponse({
      message: "Get all discounts with product successfully",
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  }
  async deleteDiscountCode(req, res, next) {
    new SuccessResponse({
      message: "Delete discount successfully",
      metadata: await DiscountService.deleteDiscountCode({
        shopId: req.user.userId,
        ...req.body,
      }),
    }).send(res);
  }
}

module.exports = new DiscountController();
