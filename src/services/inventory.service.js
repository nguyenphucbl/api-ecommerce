"use strict";

const { NotFoundError } = require("../core/error.response");
const { inventory } = require("../models/inventory.model");
const { findProduct } = require("../models/repositories/product.repo");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "123,ho chi minh",
  }) {
    const product = await findProduct({
      product_id: productId,
      unSelect: ["__v"],
    });
    if (!product) throw new NotFoundError("Product not found");
    const query = { inven_shopId: shopId, inven_productId: productId },
      updateSet = {
        $inc: { inven_stock: stock },
        $set: { inven_location: location },
      },
      options = {
        upsert: true,
        new: true,
      };
    return await inventory.findOneAndUpdate(query, updateSet, options);
  }
}
module.exports = InventoryService;
