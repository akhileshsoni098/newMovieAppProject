const express = require("express");

const UserController = require("../../controllers/userController");
const movieController = require("../../controllers/moviController")
const router = express.Router();

router.post("/registration" , UserController.userData)
router.post("/logInUser", UserController.logIn)
router.put("/updateUser/:userId", UserController.updateUser)

// movie 
router.post("/saveMovi/:adminId", movieController.saveMovie )
router.get("/getMovie/:userId", movieController.getMovie )
router.get("/getById/:userId/:movieId", movieController.getMovieById )
router.delete("/deleteMovie/:userId/:movieId",movieController.deleteMovie )

router.get("/", (req ,res)=>{
    res.send("your application is working ....")
})







module.exports = router;
 