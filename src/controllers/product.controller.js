"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service.lvxx");

class ProductController {
  async createProduct(req, res, next) {
    new SuccessResponse({
      message: "Create new Product successfully",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  }
}

module.exports = new ProductController();
