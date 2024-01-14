const express = require("express");
const router = express.Router();

const {
  getAllCustomers,
  getCustomerById,
  getCustomerByName,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getAllCustomersPagination,
  getAllAgentCustomers,
  updateCustomerStatus,
  
} = require("../controllers/customers");
const allowRoles = require("../middleware/allowRoles");
const auth = require('../middleware/auth');

const jwtAuth = require("../middleware/authJwt");


router.get("/",auth, allowRoles("admin", "staff"), getAllCustomersPagination);
router.get("/agentCustomers",auth, allowRoles("admin", "staff"), getAllAgentCustomers);
router.get("/:id", auth, allowRoles("admin", "staff"), getCustomerById);
router.get(
  "/find/:name",
  auth,
  allowRoles("admin", "staff"),
  getCustomerByName
);

router.post("/", auth,allowRoles("admin", "staff") ,createCustomer);
router.put("/:id", auth, allowRoles("admin", "staff"), updateCustomer);
router.delete("/:id", auth, allowRoles("admin" ,"staff"), deleteCustomer);


// updateCustomerStatus
router.put("/status/:id", auth, allowRoles("admin" ,"staff"), updateCustomerStatus);



module.exports = router;
