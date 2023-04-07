const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validation = require("../validattion/validation");
const bcrypt = require("bcrypt");

const userModel = require("../models/userModel");
const watchListModel = require("../models/watchListModel");
const revieweModel = require("../models/revieweModel");
const movieModel = require("../models/movieModel");

// ================== user registration ============================

const userData = async function (req, res) {
  try {
    let data = req.body;

    let { fname, lname, email, password, role } = data;
    //===============================================================
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Provide required field to register" });
    }

    //============ fname====================

    if (!fname) {
      return res
        .status(400)
        .send({ status: false, message: "first name is mandatory" });
    }

    if (typeof fname != "string") {
      return res
        .status(400)
        .send({ status: false, message: "first name should be in string" });
    }

    fname = data.fname = fname.trim();

    if (fname == "") {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter first name value" });
    }
    // regex
    if (!validation.validateName(fname)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide valid first name " });
    }
    // ========================= lname ========================

    if (!lname) {
      return res
        .status(400)
        .send({ status: false, message: "last name is mandatory" });
    }

    if (typeof lname != "string") {
      return res
        .status(400)
        .send({ status: false, message: "last name should be in string" });
    }

    lname = data.lname = lname.trim();
    if (lname == "") {
      return res
        .status(400)
        .send({ status: false, message: "Please enter last name value" });
    }
    // regex
    if (!validation.validateName(lname)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid last name " });
    }
    //================================ email ===================

    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "email is mandatory" });
    }

    if (typeof email != "string") {
      return res
        .status(400)
        .send({ status: false, message: "email id  should be in string" });
    }

    email = data.email = email.trim().toLowerCase();
    if (email == "") {
      return res
        .status(400)
        .send({ status: false, message: "Please enter email value" });
    }

    //regex
    if (!validation.validateEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid email id" });
    }
    const checkEmail = await userModel.findOne({ email: email });

    if (checkEmail) {
      return res
        .status(400)
        .send({ status: false, message: "This email is already exist" });
    }

    //============= password ===========================================================

    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is mandatory" });
    }
    if (typeof password != "string") {
      return res
        .status(400)
        .send({ status: false, message: "please provide password in string " });
    }
    password = data.password = password.trim();
    if (password == "") {
      return res
        .status(400)
        .send({ status: false, message: "Please provide password value" });
    }

    //regex password
    if (!validation.validatePassword(password)) {
      return res.status(400).send({
        status: false,
        message:
          "8-15 characters, one lowercase letter, one number and maybe one UpperCase & one special character",
      });
    }

    let hashing = bcrypt.hashSync(password, 10);
    data.password = hashing;

    // ==================== role ============================

    if (role) {
      if (typeof role != "string") {
        return res
          .status(400)
          .send({ status: false, message: `Please Provide your role` });
      }
      role = data.role = data.role.trim();

      if (
        role == null ||
        role == undefined ||
        Object.values(role).length == 0
      ) {
        return res
          .status(400)
          .send({ status: false, message: ` please Provide valid role` });
      }
      if (!["user", "admin"].includes(role)) {
        return res.status(400).send({
          status: false,
          message: " You may Register as a User or Admin",
        });
      }
    }

    //==============================================================

    let saveUser = await userModel.create(data);

    return res.status(201).send({ status: true, data: saveUser });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ======================== userLogin  ==============================

const logIn = async function (req, res) {
  try {

    let data = req.body;
if(Object.keys(data).length == 0 ){return res.status(400).send({status:false , message:"Provide your Email and Password to LogIn"})}
    let { email, password } = data;
    //===================================================

    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "email is mandatory" });
    }

    if (typeof email != "string") {
      return res
        .status(400)
        .send({ status: false, message: "email id  should be in string" });
    }

    email = data.email = email.trim().toLowerCase();
    if (email == "") {
      return res
        .status(400)
        .send({ status: false, message: "Please enter email value" });
    }

    //regex
    if (!validation.validateEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid email id" });
    }

    //========= password ===========================================================

    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is mandatory" });
    }
    if (typeof password != "string") {
      return res
        .status(400)
        .send({ status: false, message: "please provide password in string " });
    }
    password = data.password = password.trim();
    if (password == "") {
      return res
        .status(400)
        .send({ status: false, message: "Please provide password value" });
    }

    //regex password
    if (!validation.validatePassword(password)) {
      return res.status(400).send({
        status: false,
        message:
          "8-15 characters, one lowercase letter, one number and maybe one UpperCase & one special character",
      });
    }

    //=============================================================

    let isUserExist = await userModel.findOne({ email: email, isDeleted:false });

    if (!isUserExist) {
      return res
        .status(404)
        .send({ status: false, message: "No user found with given Email" });
    }

    //Decrypt
    let passwordCompare = await bcrypt.compare(password, isUserExist.password);

    if (!passwordCompare) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid password" });
    }

    if (isUserExist.isDeleted == true) {
      return res
        .status(400)
        .send({ status: false, message: "User does not Exist" });
    }

    let token = jwt.sign({ userId: isUserExist._id }, "SecreateKey");

    res
      .status(200)
      .send({ status: true, message: "successfully logIn", token: token });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//=================== get user ======================================

const userDetails = async function (req, res) {
  try {
    let userId = req.userId;
    if (!mongoose.isValidObjectId(userId) || !userId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

    const details = await userModel.findOne({ _id: userId, isDeleted: false });
    if (!details) {
      return res
        .status(404)
        .send({ status: false, message: " data not found" });
    }

    res.status(200).send({ status: true, data: details });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ==================== update user ==================================

const updateUser = async function (req, res) {
  try {
    let userId = req.userId;

    let data = req.body;

    let { fname, lname, email, password } = data;

    //====================================================================

    if (fname) {
      if (typeof fname != "string") {
        return res
          .status(400)
          .send({ status: false, message: "first name should be in string" });
      }

      fname = data.fname = fname.trim();

      if (fname == "") {
        return res
          .status(400)
          .send({ status: false, message: "Please Enter first name value" });
      }
      // regex
      if (!validation.validateName(fname)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide valid first name " });
      }
    }
    // ========================= lname ========================

    if (lname) {
      if (typeof lname != "string") {
        return res
          .status(400)
          .send({ status: false, message: "last name should be in string" });
      }

      lname = data.lname = lname.trim();
      if (lname == "") {
        return res
          .status(400)
          .send({ status: false, message: "Please enter last name value" });
      }
      // regex
      if (!validation.validateName(lname)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide valid last name " });
      }
    }
    //================================ email ===================

    if (email) {
      if (typeof email != "string") {
        return res
          .status(400)
          .send({ status: false, message: "email id  should be in string" });
      }

      email = data.email = email.trim().toLowerCase();
      if (email == "") {
        return res
          .status(400)
          .send({ status: false, message: "Please enter email value" });
      }

      //regex
      if (!validation.validateEmail(email)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide valid email id" });
      }
      const checkEmail = await userModel.findOne({ email: email });

      if (checkEmail) {
        return res
          .status(400)
          .send({ status: false, message: "This email is already exist" });
      }
    }

    //========= password ===========================================================

    if (password) {
      if (typeof password != "string") {
        return res.status(400).send({
          status: false,
          message: "please provide password in string ",
        });
      }
      password = data.password = password.trim();
      if (password == "") {
        return res
          .status(400)
          .send({ status: false, message: "Please provide password value" });
      }

      //regex password
      if (!validation.validatePassword(password)) {
        return res.status(400).send({
          status: false,
          message:
            "8-15 characters, one lowercase letter, one number and maybe one UpperCase & one special character",
        });
      }
      // hashed password ....

      let hashing = bcrypt.hashSync(password, 10);
      data.password = hashing;
    }

    //========================================================================

    let saveUser = await userModel.findByIdAndUpdate(
      { _id: userId, isDeleted: false },
      {
        $set: {
          fname: data.fname,
          lname: data.lname,
          email: data.email,
          password: data.password,
        },
      },
      { new: true }
    );

    return res.status(201).send({ status: true, data: saveUser });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//=========================== delete User ============================

const deleteUser = async function (req, res) {
  let userId = req.userId;
  if (!userId) {
    return res.status(401).send({ status: false, message: " log in again " });
  }
  if (!mongoose.isValidObjectId(userId) || !userId) {
    return res.status(400).send({ status: false, message: " Invalid Entry" });
  }

  let user = await userModel.findById(userId);
  if (user.isDeleted == true) {
    return res.status(400).send({ status: false, message: "user not found" });
  }

  if (!user) {
    return res.status(404).send({ status: false, message: "user not found" });
  }

  if (user.role == "admin") {
    await watchListModel.deleteMany({ userID: userId });
    await revieweModel.deleteMany({ userID: userId });
    await movieModel.updateMany(
      { userID: userId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  }
  if (user.role == "user") {
    await watchListModel.deleteMany({ userID: userId });
    await revieweModel.deleteMany({ userID: userId });
  }

  await userModel.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  );

  res.status(200).send({ status: true, message: "Deleted successfully" });
};

module.exports = { userData, logIn, userDetails, updateUser, deleteUser };
