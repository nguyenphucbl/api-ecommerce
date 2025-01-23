"use strict";

const cartModel = require("../models/cart.model");

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
    const query = { cart_userId: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
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
  //end repo cart
  static async addToCart({ userId, product = {} }) {
    // check if product exists
    const userCart = await cartModel.findOne({ cart_userId: userId });
    if (!userCart) {
      // create cart
      return await this.createUserCart({ userId, product });
    }
    // if cart exists but product does not exist
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }
    // if product exists in cart
    return await this.updateQuantityInUserCart({ userId, product });
  }
  //update
}

module.exports = CartService;
