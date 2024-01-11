const jwt = require("jsonwebtoken");
const jwtSettings = require("../constants/jwtSettings");
const bcrypt = require("bcrypt");

const nodemailer = require("nodemailer");

const Employee = require("../models/employee");
const tryCatch = require("./utils/tryCatch");

const registerEmployee = tryCatch(async (req, res) => {
  const data = req.body;
  const employee = new Employee(data);

  //HASH PASSWORD
  const salt = await bcrypt.genSalt(10);
  employee.password = await bcrypt.hash(employee.password, salt);
  const employeedata = await employee.save();
  res.status(201).json({ ok: true ,employeedata });
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
        expiresIn: 8640000, // TOKEN WILL EXIST IN 24 hours
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
    res.status(401).json({ error: "User not exist" });
  }
});



forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const foundUser = await Employee.findOne({ email });

    if (!foundUser) {
      return res.status(404).send({ message: "Email not registered." });
    }

    const newPassword = Math.random().toString(36).substring(2, 8);
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await Employee.findByIdAndUpdate(
      foundUser._id,
      { password: hashedPassword },
      { new: true }
      
    );

    res.status(200).send({
      message: `Your new password is: ${newPassword}`,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};



resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({ message: "Your Email is not exist" });
    }
    const foundUser = await Employee.findOne({ email });
    if (!foundUser) {
      return res.status(404).send({ message: "Emil not Existtt" });
    }

    const newPassword = Math.random().toString(36).substring(2, 8);
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await Employee.findByIdAndUpdate(
      foundUser._id,
      { password: hashedPassword },
      { new: true }
    );

    let transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      host: 'smtp.gmail.com',
      secure: true,
      auth: {
   
  //       user: "bbvh hors bgbq pxjm" ,
  // pass:"noreply.springworthbooks@gmail.com"

      user: "itesa.getViral@gmail.com",
         pass: "rtspkviskcrhorey",
      },
    });

    let mailOptions = {
      from: "system@gmail.com",
      to: email,
      subject: "Hi, shop TienDat.Cam",
      text: `Your new password: ${newPassword}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.status(200).send({
          message: "reset password link sended",
        });
      }
    });
  } catch (error) {
    res.status(401).json({message:error.message})
    console.log(error);
  }
};






module.exports = { registerEmployee, loginEmployee ,forgotPassword ,resetPassword };
