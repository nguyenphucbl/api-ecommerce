const { convertToObjectId } = require("../../utils");
const { inventory } = require("../inventory.model");
const { Types } = require("mongoose");
const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await inventory.create({
    inven_productId: productId,
    inven_location: location,
    inven_stock: stock,
    inven_shopId: shopId,
  });
};
const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: convertToObjectId(productId),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        inven_stock: -quantity,
      },
      $push: {
        inven_reservation: {
          cartId,
          quantity,
          createdAt: new Date(),
        },
      },
    },
    options = {
      upsert: true,
      new: true,
    };
  return await inventory.findOneAndUpdate(query, updateSet, options);
};
module.exports = {
  insertInventory,
  reservationInventory,
};
