const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const employeeSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: String,
    address: { type: String, required: true },
    birthday: Date,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 3 },
    roles: { type: Array, default: "staff" },
  },
  {
    query: {
      byFullName(name) {
        return this.where({ fullName: new RegExp(name, "i") });
      },
      byRole(role) {
        return this.where(
           { roles:role }
        //  { role: { "$in" : [role]} } 
          );
      },

    },
  }
);
const Employee = model("Employee", employeeSchema);
module.exports = Employee;
