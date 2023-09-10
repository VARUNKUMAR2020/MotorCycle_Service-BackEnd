const mongo = require("mongoose");

const user = new mongo.Schema(
    {
      firstName:String,
      lastName:String,
      gender:String,
      dob:String,
      email:String,
      password:String,
      mobile:String,
    })

    const User = mongo.model("User",user);
    module.exports = User;
