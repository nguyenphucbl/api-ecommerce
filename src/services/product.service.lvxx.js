"use strict";

const {
  clothing,
  electronic,
  product,
  furniture,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProduct,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObject } = require("../utils");
const { insertInventory } = require("../models/repositories/inventory.repo");
// define factory class to create product

class ProductFactory {
  /*

  type: "Clothing", "Electronic"
  payload:
  */
  static productRegistry = {}; //key-class
  static registerProductType(type, classRef) {
    this.productRegistry[type] = classRef;
  }
  static async createProduct(type, payload) {
    const productClass = this.productRegistry[type];
    if (!productClass) throw new BadRequestError("Invalid product type");
    return await new productClass(payload).createProduct();
  }
  static async updateProduct(type, product_id, payload) {
    const productClass = this.productRegistry[type];
    if (!productClass) throw new BadRequestError("Invalid product type");
    return await new productClass(payload).updateProduct(product_id);
  }
  //put
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  // query
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }
  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }
  static async searchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }
  static async findAllProduct({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProduct({
      limit,
      sort,
      page,
      filter,
      select: [
        "product_name",
        "product_thumb",
        "product_price",
        "product_shop",
      ],
    });
  }
  static async findProduct({ product_id }) {
    return await findProduct({
      product_id,
      unSelect: ["__v", "product_variations"],
    });
  }
  // end query
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
  async createProduct(product_id) {
    const newProduct = await product.create({
      ...this,
      _id: product_id,
    });
    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: newProduct.product_shop,
        stock: newProduct.product_quantity,
      });
    }
    return newProduct;
  }
  // update product
  async updateProduct(product_id, payload) {
    return await updateProductById({ product_id, payload, model: product });
  }
}
// define sub-class for different product types
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing)
      throw new BadRequestError("Failed to create new clothing");
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Failed to create new product");
    return newProduct;
  }
  async updateProduct(product_id) {
    // remove attribute has null or undefined value
    // console.log("1:::", this);
    const objectParams = removeUndefinedObject(this);
    // console.log("2:::", objectParams);
    if (objectParams.product_attributes) {
      //update child
      await updateProductById({
        product_id,
        payload: updateNestedObject(objectParams.product_attributes),
        model: clothing,
      });
    }
    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObject(objectParams)
    );
    return updateProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Failed to create new electronic");
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Failed to create new product");
    return newProduct;
  }
  async updateProduct(product_id) {
    // remove attribute has null or undefined value
    // console.log("1:::", this);
    const objectParams = removeUndefinedObject(this);
    // console.log("2:::", objectParams);
    if (objectParams.product_attributes) {
      //update child
      await updateProductById({
        product_id,
        payload: updateNestedObject(objectParams.product_attributes),
        model: electronic,
      });
    }
    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObject(objectParams)
    );
    return updateProduct;
  }
}
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture)
      throw new BadRequestError("Failed to create new furniture");
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Failed to create new product");
    return newProduct;
  }
  async updateProduct(product_id) {
    // remove attribute has null or undefined value
    // console.log("1:::", this);
    const objectParams = removeUndefinedObject(this);
    // console.log("2:::", objectParams);
    if (objectParams.product_attributes) {
      //update child
      await updateProductById({
        product_id,
        payload: updateNestedObject(objectParams.product_attributes),
        model: furniture,
      });
    }
    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObject(objectParams)
    );
    return updateProduct;
  }
}
// register product type
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Furniture", Furniture);
module.exports = ProductFactory;
