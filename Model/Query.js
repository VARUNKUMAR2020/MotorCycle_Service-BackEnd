const mongo = require("mongoose");
const { schema } = require("./user");

const query = new mongo.Schema({
  name:String,
  mobile:String,
  mail:String,
  query:String
})

const Query = mongo.model("Query",query);
module.exports = Query;