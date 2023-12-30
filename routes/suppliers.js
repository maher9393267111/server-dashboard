const express = require("express");
const router = express.Router();

const {
  getAllSuppliers,
  getSupplierById,
  getSupplierByName,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/suppliers");
const allowRoles = require("../middleware/allowRoles");
const auth = require("../middleware/auth");

router.get("/", auth, allowRoles("admin", "staff"), getAllSuppliers);
router.get("/v1", getAllSuppliers);
router.get("/:id", auth, allowRoles("admin", "staff"), getSupplierById);
router.get(
  "/find/:name",
  auth,
  allowRoles("admin", "staff"),
  getSupplierByName
);
router.post("/", auth, allowRoles("admin"), createSupplier);
router.put("/:id", auth, allowRoles("admin"), updateSupplier);
router.delete("/:id", auth, allowRoles("admin"), deleteSupplier);

module.exports = router;
