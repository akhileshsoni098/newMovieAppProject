const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel")
const authentication = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];

    if (!token) {
      return res
        .status(400)
        .send({ status: false, message: "Token not present" });
    }

    token = token.split(" ");

    // console.log(token[1])

    jwt.verify(token[1], "SecreateKey", async function (err, decoded) {
      if (err)
        return res.status(401).send({ status: false, message: err.message });
      else {
        req.userId = decoded.userId;

        let checkUser = await userModel.findById(req.userId)
if(checkUser.isDeleted == true){return res.status(400).send({status:false , message:"user does not exist"})}

        next();
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { authentication };
