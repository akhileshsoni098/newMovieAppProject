const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/userController");
const movieController = require("../../controllers/moviController")
const watchlistContro = require("../../controllers/watchListController")
const reviewContro = require("../../controllers/revieweController")

// user and admin both 
router.post("/registration" , UserController.userData)
router.post("/logInUser", UserController.logIn)
router.get("/getUser/:userId", UserController.userDetails)
router.put("/updateUser/:userId", UserController.updateUser)

// delete user # have to create 

// movie 

router.post("/saveMovi/:adminId", movieController.saveMovie )
router.get("/getMovie/:userId", movieController.getMovie )
router.get("/getById/:userId/:movieId", movieController.getMovieById )
router.delete("/deleteMovie/:userId/:movieId",movieController.deleteMovie )


// watchList 

router.get("/getWatchList/:userId", watchlistContro.watchlistDetails )
router.delete("/deleteMovieWatchList/:userId/:movieId", watchlistContro.delParticular )
router.delete("/clearAllWatchList/:userId", watchlistContro.clearWatchList )


//review 
router.post("/review/:userId", reviewContro.reviewdata)
router.get("/getParticular/:userId", reviewContro.getParticular)
router.get("/getAllReview/:userId", reviewContro.getAllReviews)
router.put("/reviewUpdate/:userId", reviewContro.updateReview)
router.delete("/particularReviewDelete/:userId", reviewContro.DeleteParticular)
router.delete("/allReviewDelete/:userId", reviewContro.DeleteAll)


//test application
router.get("/", (req ,res)=>{
    res.send("your application is working ....")
})







module.exports = router;
 