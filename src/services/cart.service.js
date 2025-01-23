"use strict";

const { NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const { findProduct } = require("../models/repositories/product.repo");

/**
 * @description Cart service
 * 1. add product to cart [User]
 * 2. reduce product quantity from cart [User]
 * 3. increase product quantity from cart [User]
 * 4. get cart [User]
 * 5. delete product from cart [User]
 * 6. clear cart [User]
 */

class CartService {
  /// repo cart
  static async createUserCart({ userId, product }) {
    const foundProduct = await findProduct({
      product_id: product.productId,
      unSelect: ["__v"],
    });
    if (!foundProduct) throw new NotFoundError("Product not found");
    const query = {
        cart_userId: userId,
        cart_state: "active",
      },
      updateOrInsert = {
        $addToSet: {
          cart_products: {
            ...product,
            price: foundProduct.product_price,
            name: foundProduct.product_name,
          },
        },
      },
      options = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }
  static async updateQuantityInUserCart({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateSet, options);
  }
  static async deleteProductFromUserCart({ userId, productId }) {
    const query = {
        cart_userId: userId,
        cart_state: "active",
      },
      updateSet = {
        $pull: {
          cart_products: { productId },
        },
      };
    const deleteCart = await cartModel.updateOne(query, updateSet);
    return deleteCart;
  }
  static async getListUserCart({ userId }) {
    return await cartModel
      .findOne({ cart_userId: userId, cart_state: "active" })
      .lean();
  }
  //end repo cart
  static async addToCart({ userId, product = {} }) {
    // check if product exists
    const userCart = await cartModel.findOne({ cart_userId: userId });
    const foundProduct = await findProduct({
      product_id: product.productId,
      unSelect: ["__v"],
    });
    if (!userCart) {
      // create cart
      return await this.createUserCart({ userId, product });
    }
    // if cart exists but product does not exist
    if (!userCart.cart_products.length) {
      userCart.cart_products.push({
        ...product,
        price: foundProduct.product_price,
        name: foundProduct.product_name,
      });
      return await userCart.save();
    }
    // if product exists in cart
    return await this.updateQuantityInUserCart({ userId, product });
  }
  //update cart v2
  /*
    1. shop_order_ids: [ {shopId,item_products:[{quantity,productId, old_quantity,price}],version}]
   */
  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    // check if product exists
    const foundProduct = await findProduct({
      product_id: productId,
      unSelect: ["__v"],
    });
    if (!foundProduct) throw new NotFoundError("Product not found");
    //compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFoundError("Product not found in shop");
    if (quantity === 0) {
      //delete product
      return await this.deleteProductFromUserCart({ userId, productId });
    }
    return await this.updateQuantityInUserCart({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }
}

module.exports = CartService;
