const User = require("../Model/user");
const bcrypt = require("bcrypt");

//Home Address of the server
exports.home = (req, res) => {
  res.send("Server is Ready and It is in Home Page");
};

//Register the Data in the Database
exports.register = async (req, res) => {
  const { firstName, lastName, gender, dob, email, password, mobile } =
    req.body;

  //Encrypting Password
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(200).json({ status: "User Exits !!" });
    } else {
      await User.create({
        firstName,
        lastName,
        gender,
        dob,
        email,
        password: encryptedPassword,
        mobile,
      });
      res.status(201).json({ status: "Created SuccessFully" });
    }
  } catch (error) {
    res.status(400).json({ status: "Error" });
  }
};
