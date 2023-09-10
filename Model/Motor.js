const mongo = require("mongoose");
const { schema } = require("./user");

const motor = new mongo.Schema({
  email:String,
  name:String,
  service:[{
    reg_no:String,
    status:String
  }]
})

const Motor = mongo.model("MotorCycle",motor);
module.exports = Motor;