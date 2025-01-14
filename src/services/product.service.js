"use strict";

const { clothing, electronic, product } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
// define factory class to create product

class ProductFactory {
  /*

  type: "Clothing", "Electronic"
  payload:
  */
  static async createProduct(type, payload) {
    switch (type) {
      case "Electronics":
        return await new Electronics(payload).createProduct();
      case "Clothes":
        return await new Clothing(payload).createProduct();
      default:
        throw new BadRequestError("Invalid product type");
    }
  }
}

// define base product class

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }
  // create new product
  async createProduct() {
    return await product.create(this);
  }
}
// define sub-class for different product types
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing)
      throw new BadRequestError("Failed to create new clothing");
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Failed to create new product");
    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create(this.product_attributes);
    if (!newElectronic)
      throw new BadRequestError("Failed to create new electronic");
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Failed to create new product");
    return newProduct;
  }
}
module.exports = ProductFactory;
