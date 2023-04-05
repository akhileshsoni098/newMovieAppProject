const express = require("express");

const UserController = require("../../controllers/userController");

const router = express.Router();

router.post("/registration" , UserController.userData)
router.post("/logInUser", UserController.logIn)
router.put("/updateUser/:userId", UserController.updateUser)


router.get("/", (req ,res)=>{
    res.send("your application is working ....")
})







module.exports = router;
 