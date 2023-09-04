const express = require("express");
const router = express.Router();
const{home,register} = require("../Controller/apicontroller")

//API Routers
router.route('/').get(home);
router.route('/register').post(register);

module.exports=router;