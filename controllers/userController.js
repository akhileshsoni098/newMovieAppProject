const mongoose = require("mongoose");

const BaseController = require("./baseController");

const userSchema = require("../models/userModel");

const User = mongoose.model("MoviUser", userSchema)

class UserController extends BaseController {
  constructor() {
    super(User);
  } 

  async createauthor (req , res){
    const data = req.body
 let saveuser =   await  User.create(data)
 console.log(req.body)
 return res.send(saveuser)
  }


} 

module.exports = UserController;
