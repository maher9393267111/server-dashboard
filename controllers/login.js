const jwt = require("jsonwebtoken");
const jwtSettings = require("../constants/jwtSettings");
const bcrypt = require("bcrypt");

const Employee = require("../models/employee");
const tryCatch = require("./utils/tryCatch");

const registerEmployee = tryCatch(async (req, res) => {
  const data = req.body;
  const employee = new Employee(data);

  //HASH PASSWORD
  const salt = await bcrypt.genSalt(10);
  employee.password = await bcrypt.hash(employee.password, salt);
  await employee.save();
  res.status(201).json({ ok: true });
});

const loginEmployee = tryCatch(async (req, res) => {
  const { username, password } = req.body;
  const employee = await Employee.findOne({ username });
  if (employee) {
    // check employee password with hashed password stored in the database
    const validPassword = await bcrypt.compare(password, employee.password);
    if (validPassword) {
      const payload = {
        id: employee._id,
        fullName: employee.fullName,
        roles: employee.roles,
      };

      const token = jwt.sign(payload, jwtSettings.SECRET, {
        expiresIn: 86400, // TOKEN WILL EXIST IN 24 hours
        algorithm: "HS512",
      });

      // res.header("Authorization", "Bearer " + token);
      res.status(200).json({
        token: token,
        payload,
      });
    } else {
      res.status(400).json({ error: "Invalid Password" });
    }
  } else {
    res.status(401).json({ error: "User does not exist" });
  }
});

module.exports = { registerEmployee, loginEmployee };
