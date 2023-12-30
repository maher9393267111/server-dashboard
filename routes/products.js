const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  getAllProducts,
  getProductById,
  getProductByName,
  createProduct,
  updateProduct,
  deleteProduct,
  stockProduct,
  searchProductByCategory,
  filterProduct,
  getAllProductsAdmin
} = require("../controllers/products");
const allowRoles = require("../middleware/allowRoles");

const auth = passport.authenticate("jwt", { session: false });

router.get("/filter", filterProduct);
router.get("/search/:name", getProductByName);
router.get("/", auth, allowRoles("admin", "staff"), getAllProductsAdmin);
router.get("/v1", getAllProducts);
router.get("/:id", auth, allowRoles("admin", "staff"), getProductById);
router.get("/v2/:id", getProductById);
router.post("/", auth, allowRoles("admin"), createProduct);
router.patch("/:id", auth, allowRoles("admin"), updateProduct);
router.delete("/:id", auth, allowRoles("admin"), deleteProduct);

//Hiển thị tất cả mặt hàng có tồn kho dưới 50
router.get("/stock/find", auth, allowRoles("admin", "staff"), stockProduct);
router.get("/search/category/:categoryId", searchProductByCategory);

module.exports = router;
