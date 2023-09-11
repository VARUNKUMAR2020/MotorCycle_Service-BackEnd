require("dotenv").config();
const mongo = require("mongoose");

exports.Database = () => {
  mongo
    .connect("mongodb+srv://root:root@motorcylce-service.h6l2gtp.mongodb.net/")
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log(`Error is Database connectivity : ${err}`));
};
 