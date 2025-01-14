"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  async createProduct(req, res, next) {
    new SuccessResponse({
      message: "Create new Product successfully",
      metadata: await ProductService.createProduct(
        req.body.product_type,
        req.body
      ),
    }).send(res);
  }
}

module.exports = new ProductController();
