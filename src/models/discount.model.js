"use strict";

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      default: "fixed_amount", // precentage
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_max_uses: {
      type: Number,
      required: true,
    }, // volume of discount
    discount_uses_count: {
      type: Number,
      required: true,
    }, // volume used of discount
    discount_users_used: {
      type: [
        {
          userId: { type: Schema.Types.ObjectId, ref: "Shop" },
          used_count: Number,
        },
      ],
      default: [],
    }, // who used this discount
    discount_max_uses_per_user: {
      type: Number,
      required: true,
    }, // volume of discount per user
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    }, // all or specific products
    discount_product_ids: {
      type: Array,
      default: [],
    }, // if applies to specific products
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
