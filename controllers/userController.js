const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")


const userModel = require("../models/userModel");
const watchListModel = require("../models/watchListModel");
const revieweModel = require("../models/revieweModel");
const movieModel = require("../models/movieModel");

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

let token = jwt.sign({userId:checkEmail._id},"SecreateKey")

res.status(200).send({status:true , message:"successfully logIn", token:token})
} catch (err) {
  res.status(500).send({ status: false, message: err.message });
}
}



//=================== get user ==============================


const userDetails = async function(req,res){

      let userId =  req.userId 

  const details = await userModel.findOne({_id:userId , isDeleted:false})

res.status(200).send({status:false , data:details})

}





// ==================== update user =============================

const updateUser = async function (req, res) {
  try {
    let userId =  req.userId 

    const data = req.body;

    const { fname, lname, email, password } = data;

    const checkEmail = await userModel.findOne({email: email});

    if (checkEmail) {
      return res
        .status(400)
        .send({ status: false, message: "this email is already exist" });
    }

    let saveUser = await userModel.findByIdAndUpdate({_id:userId,isDeleted:false},
      {$set:{ fname:data.fname ,lname:data.lname, email:data.email, password:data.password }},{new:true})

    return res.status(201).send({ status: true, data: saveUser });

  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};


//=========================== delete User ============================

const deleteUser = async function(req,res){

  let userId = req.userId
if(!userId){return res.status(401).send({status:false , message:" log in again "})}

let user = await userModel.findById(userId)
if(user.isDeleted == true){return res.status(400).send({status:false, message:"user not found"})}

if(!user){return res.status(404).send({status:false, message:"user not found"})}

if(user.role == "admin"){
  await watchListModel.deleteMany({userID:userId})
  await revieweModel.deleteMany({userID:userId})
  await movieModel.updateMany({userID:userId, isDeleted:false},{isDeleted:true},{new:true})
}
if(user.role == "user"){

  await watchListModel.deleteMany({userID:userId})
  await revieweModel.deleteMany({userID:userId})
}

await userModel.findOneAndUpdate({_id:userId,isDeleted:false},{$set: {isDeleted:true}},{new:true})

res.status(200).send({status:true , message:"Deleted successfully"})

}






module.exports = {userData, logIn,userDetails, updateUser,deleteUser} 