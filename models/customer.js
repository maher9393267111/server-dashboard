const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const customerSchema = new Schema(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: false  ,default:"pending@email" },
    phoneNumber: String,

    address: { type: String, required: false },
    birthday: Date,
    status :{type:String ,required :true , default:"pending"}
  },
  {

    query: {
      byFirstName(name) {
        return this.where({ firstName: new RegExp(name, "i") });
      },
    },
  }
);
const Customer = model("Customer", customerSchema);
module.exports = Customer;
