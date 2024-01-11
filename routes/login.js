const express = require("express");
const router = express.Router();

const { registerEmployee, loginEmployee ,forgotPassword ,resetPassword } = require("../controllers/login");

router.post("/register", registerEmployee);
router.post("/login", loginEmployee);
router.post("/forgetpass", forgotPassword);
router.post("/resetpass", resetPassword);


module.exports = router;
