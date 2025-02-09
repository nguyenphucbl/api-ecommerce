const express = require("express");
const ProductController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

// query
router.get(
  "/search/:keySearch",
  asyncHandler(ProductController.getListSearchProduct)
);
router.get("", asyncHandler(ProductController.findAllProduct));
router.get("/:product_id", asyncHandler(ProductController.findProduct));
// authentication
router.use(authenticationV2);

// mutation
router.post("", asyncHandler(ProductController.createProduct));
router.patch("/:product_id", asyncHandler(ProductController.updateProduct));
router.post(
  "/publish/:product_id",
  asyncHandler(ProductController.publishProductByShop)
);
router.post(
  "/unpublish/:product_id",
  asyncHandler(ProductController.unPublishProductByShop)
);
// query
router.get("/drafts/all", asyncHandler(ProductController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(ProductController.getAllPublishedForShop)
);

module.exports = router;
