const mongoose = require("mongoose");
const { array } = require("yup/lib/locale");
const { Schema, model } = mongoose;

const customerSchema = new Schema(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: false  ,default:"pending@email" },
    phoneNumber: String,

    address: { type: String, required: false },
    birthday: Date,
    status :{type:String ,required :true , default:"pending"},
   
    file: { link:String , filename:String },
 audio:String,
    files:{type:Array},
    birthday: {type:String},
    gender:{type:String},
    ssn:{type:Number},
    zip:{type:Number},
    signature:{type:String},
    city:{type:String},
    state:{type:String},
    work:{type:String},
    signature:{type:String},
    date: { type: Date, default: Date.now },
    SearchedBy: {type:String ,default:"created"}, 
    process:{type:Boolean},
    note:{type:String},
    time:{type:String},
    agreement:{type:Boolean ,default:false},
    
  employe_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },

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
