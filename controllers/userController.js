const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")


const userModel = require("../models/userModel");

// ================== user registration============================


const userData = async function (req, res) {
  try {
    const data = req.body;

    const { fname, lname, email, password, role } = data;

    const checkEmail = await userModel.findOne({email: email});

    if (checkEmail) {
      return res
        .status(400)
        .send({ status: false, message: "this email is already exist" });
    }

    let saveUser = await userModel.create(data);
 
    return res.status(201).send({ status: true, data: saveUser });

  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ======================== userLogin  ===========================

const logIn = async function(req, res){
  try{
  const data = req.body

  const {email, password} = data

  const checkEmail = await userModel.findOne({email: email});

  if (!checkEmail) {
    return res
      .status(400)
      .send({ status: false, message: "this email is not exist" });
  }

let token = jwt.sign({userId:checkEmail._id},"secreteKey")

res.status(200).send({status:true , message:"successfully logIn", token:token})
} catch (err) {
  res.status(500).send({ status: false, message: err.message });
}
}

// ==================== update user =============================

const updateUser = async function (req, res) {
  try {
    const userId = req.params.userId
    const data = req.body;

    const { fname, lname, email, password } = data;

    const checkEmail = await userModel.findOne({email: email});

    if (checkEmail) {
      return res
        .status(400)
        .send({ status: false, message: "this email is already exist" });
    }

    let saveUser = await userModel.findByIdAndUpdate({_id:userId},
      {$set:{ fname:data.fname ,lname:data.lname, email:data.email, password:data.password }},{new:true})

    return res.status(201).send({ status: true, data: saveUser });

  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};


//===================== delete User ============================


// if user delete his account then watchlis of this particular user and rating and review of this user also be remove ...




module.exports = {userData, logIn, updateUser} 