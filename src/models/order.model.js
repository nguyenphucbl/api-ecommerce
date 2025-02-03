"use strict";

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";
const orderSchema = new Schema(
  {
    order_userId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    order_checkout: {
      type: Object,
      default: {},
    },
    /**
     * {
     *  totalPrice: 0,
     * feeShip: 0,
     * totalDiscount: 0,
     * }
     */
    order_shipping: {
      type: Object,
      default: {},
    },
    /**
     * {
     *  address: {
     *    city: "",
     *    district: "",
     *    ward: "",
     *    street: "",
     *  },
     *  phone: "",
     *  email: "",
     * }
     */
    order_payment: {
      type: Object,
      default: {},
    },
    order_products: {
      type: Array,
      required: true,
    },
    order_trackingNumber: {
      type: String,
      default: "#000002022025",
    },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "delivered", "canceled", "shipping"],
      default: "pending",
    },
  },
  { collection: COLLECTION_NAME, timestamps: true }
);
module.exports = model(DOCUMENT_NAME, orderSchema);
