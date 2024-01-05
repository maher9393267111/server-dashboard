const express = require("express");
const router = express.Router();

const {
    getAllNotifications

} = require("../controllers/notifications");
const allowRoles = require("../middleware/allowRoles");
const auth = require('../middleware/auth');


router.get("/",auth, allowRoles("admin", "staff"),  getAllNotifications);
// router.get("/:id", auth, allowRoles("admin", "staff"), getCustomerById);
// router.get(
//   "/find/:name",
//   auth,
//   allowRoles("admin", "staff"),
//   getCustomerByName
// );

// router.post("/", createCustomer);
// router.put("/:id", auth, allowRoles("admin", "staff"), updateCustomer);
// router.delete("/:id", auth, allowRoles("admin" ,"staff"), deleteCustomer);



module.exports = router;

