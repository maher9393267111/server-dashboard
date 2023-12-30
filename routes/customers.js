const express = require("express");
const router = express.Router();

const {
  getAllCustomers,
  getCustomerById,
  getCustomerByName,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customers");
const allowRoles = require("../middleware/allowRoles");
const auth = require('../middleware/auth');

router.get("/", auth, allowRoles("admin", "staff"), getAllCustomers);
router.get("/:id", auth, allowRoles("admin", "staff"), getCustomerById);
router.get(
  "/find/:name",
  auth,
  allowRoles("admin", "staff"),
  getCustomerByName
);
router.post("/", createCustomer);
router.put("/:id", auth, allowRoles("admin"), updateCustomer);
router.delete("/:id", auth, allowRoles("admin"), deleteCustomer);

module.exports = router;
