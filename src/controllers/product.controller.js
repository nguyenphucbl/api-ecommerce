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
  async publishProductByShop(req, res, next) {
    new SuccessResponse({
      message: "Publish product successfully",
      metadata: await ProductService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.product_id,
      }),
    }).send(res);
  }
  async unPublishProductByShop(req, res, next) {
    new SuccessResponse({
      message: "Unpublish product successfully",
      metadata: await ProductService.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.product_id,
      }),
    }).send(res);
  }
  //update product
  async updateProduct(req, res, next) {
    new SuccessResponse({
      message: "update product successfully",
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.params.product_id,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  }
  // query
  /**
   *
   * @description Get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @param {product_shop} req.user.userId
   * @return {Array} metadata
   */
  async getAllDraftsForShop(req, res, next) {
    new SuccessResponse({
      message: "Get all drafts for shop successfully",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  }
  async getAllPublishedForShop(req, res, next) {
    new SuccessResponse({
      message: "Get all published for shop successfully",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  }
  async getListSearchProduct(req, res, next) {
    new SuccessResponse({
      message: "Get list product successfully",
      metadata: await ProductService.searchProduct(req.params),
    }).send(res);
  }
  async findAllProduct(req, res, next) {
    new SuccessResponse({
      message: "Get all product successfully",
      metadata: await ProductService.findAllProduct(req.query),
    }).send(res);
  }
  async findProduct(req, res, next) {
    new SuccessResponse({
      message: "Get product successfully",
      metadata: await ProductService.findProduct(req.params),
    }).send(res);
  }
  // end query
}

module.exports = new ProductController();
