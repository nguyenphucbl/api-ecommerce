"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const {
  findAllDiscountUnSelect,
} = require("../models/repositories/discount.repo");
const { findAllProduct } = require("../models/repositories/product.repo");
const { convertToObjectId } = require("../utils");

/**
 * @description Discount service
 * 1. Generate discount code [Shop|Admin]
 * 2. Get discount amount [User]
 * 3. Get all discount codes [User | Shop]
 * 4. Verify discount code [User]
 * 5. Delete discount code [Shop|Admin]
 * 6. Cancel discount code [user]
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      // max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;
    // verify
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code has expired");
    }
    if (new Date(start_date) >= newDate(end_date)) {
      throw new BadRequestError(
        "Discount code start date must be less than end date"
      );
    }
    // create index for discount code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      })
      .lean();
    if (foundDiscount)
      throw new BadRequestError("Discount code already exists");
    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      // discount_max_value: max_value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_min_order_value: min_order_value || 0,
      discount_shopId: convertToObjectId(shopId),
      discount_product_ids: applies_to === "all" ? [] : product_ids,
      discount_applies_to: applies_to,
      discount_max_uses: max_uses,
      discount_is_active: is_active,
      discount_uses_count: uses_count,
      discount_max_uses_per_user: max_uses_per_user,
    });
    return newDiscount;
  }
  // update discount code
  static async updateDiscountCode(discount_id, payload) {
    const foundDiscount = await discountModel.findById(discount_id);
    if (!foundDiscount) throw new NotFoundError("Discount code not found");
    const newDiscount = await discountModel.findByIdAndUpdate(
      discount_id,
      payload,
      { new: true }
    );
    return newDiscount;
  }
  /**
   * @description Get all discount codes available with product
   */
  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      })
      .lean();
    if (!foundDiscount || !foundDiscount.discount_is_active)
      throw new NotFoundError("Discount code not found");
    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      // get all products
      products = await findAllProduct({
        filter: {
          product_shop: convertToObjectId(shopId),
          isPublished: true,
        },
        limit: +limit || 10,
        page: +page || 1,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    if (discount_applies_to === "specific") {
      // get specific products
      products = await findAllProduct({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit || 10,
        page: +page || 1,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    return products;
  }
  // get all discount codes of shop
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectId(shopId),
        discount_is_active: true,
      },
      model: discountModel,
      unSelect: ["__v", "discount_shopId"],
    });
    return discounts;
  }
}
