const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  getAllEmployees,
  getEmployeeById,
  getEmployeeByName,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employees");
const allowRoles = require("../middleware/allowRoles");

const auth = passport.authenticate("jwt", { session: false });

router.get("/", auth, allowRoles("admin", "staff"), getAllEmployees);
router.get("/:id", auth, allowRoles("admin", "staff"), getEmployeeById);
router.get(
  "/find/:name",
  auth,
  allowRoles("admin", "staff"),
  getEmployeeByName
);
router.patch("/:id", auth, allowRoles("admin"), updateEmployee);
router.delete("/:id", auth, allowRoles("admin"), deleteEmployee);

module.exports = router;
