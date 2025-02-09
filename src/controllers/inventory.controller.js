"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
  async addStockToInventory(req, res, next) {
    new CREATED({
      message: "Create inventory  successfully",
      metadata: await InventoryService.addStockToInventory(req.body).send(res),
    });
  }
}

module.exports = new InventoryController();
