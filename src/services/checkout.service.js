"use strict";

const { BadRequestError } = require("../core/error.response");
const orderModel = require("../models/order.model");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquiredLock, releaseLock } = require("./redis.service");

class CheckoutService {
  /**
   * @param {Object} payload
   * {
   *    cartId: string,
   *    userId: string,
   *    shop_order_ids: [
   *      {
   *        shopId,
   *        shop_discount: [
   *          {
   *            shopId,
   *            discountId,
   *            code
   *          }
   *        ],
   *        products: [
   *          {
   *            productId,
   *            quantity,
   *            price
   *          }
   *        ]
   *      }
   *    ]
   * }
   */

  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // check cartId exist
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new BadRequestError("Cart not found");
    }
    const checkoutOrder = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discount = [], products = [] } = shop_order_ids[i];
      const checkProductServer = await checkProductByServer(products);
      console.log(
        "🚀 ~ CheckoutService ~ checkoutReview ~ checkProductServer:",
        checkProductServer
      );
      if (!checkProductServer[0])
        throw new BadRequestError("order product wrong");
      // total price of each product
      const checkoutPrice = foundCart.cart_products.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      // total price of each shop
      checkoutOrder.totalPrice += checkoutPrice;
      const itemCheckout = {
        shopId,
        shop_discount,
        priceRaw: checkoutPrice, //not include discount
        priceApplyDiscount: checkoutPrice, // include discount
        products: foundCart.cart_products,
      };
      // if shop_discount exist
      if (shop_discount.length > 0) {
        //if one discount code apply for one shop
        const { totalPrice, amount } = await getDiscountAmount({
          code: shop_discount[0].code,
          userId,
          shopId,
          products: foundCart.cart_products,
        });
        checkoutOrder.totalDiscount += amount;
        if (amount > 0) {
          itemCheckout.priceApplyDiscount = totalPrice - amount;
        }
      }
      // total last price
      checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }
    return {
      shop_order_ids,
      shop_order_ids_new,
      checkoutOrder,
    };
  }
  // order
  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address,
    user_payment,
  }) {
    const { shop_order_ids_new, checkoutOrder } = await this.checkoutReview({
      userId,
      cartId,
      shop_order_ids,
    });
    //check inventory of product before order
    // get new array of product
    const products = shop_order_ids_new.flatMap((item) => item.products);
    console.log(
      "🚀 ~ file: checkout.service.js ~ line 108 ~ CheckoutService ~ orderByUser ~ products",
      products
    );
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquiredLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }
    // if one of product not enough stock
    if (acquireProduct.includes(false)) {
      throw new BadRequestError("Product not enough stock");
    }
    // order success
    const newOrder = await orderModel.create({
      order_userId: userId,
      order_checkout: checkoutOrder,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });
    //if order success, remove product from cart
    if (newOrder) {
      await foundCart.remove();
    }
    return newOrder;
  }
  /**
   * 1. query order by userId
   */
  static async getOrderByUser(userId) {}
  /**
   * 1. query order by orderId
   */
  static async getOneOrderByUser() {}
  /**
   * 1. cancel Order [user]

   */
  static async cancelOrderByUser() {}
  /**
   * 1. update Order status [admin|shop]
   */
  static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService;
