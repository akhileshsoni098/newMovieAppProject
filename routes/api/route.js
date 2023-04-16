const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/userController");
const movieController = require("../../controllers/moviController");
const watchlistContro = require("../../controllers/watchListController");
const reviewContro = require("../../controllers/revieweController");

const auth = require("../../middi/auth");


//=================================== for frontend ===============================

router.get("/api/auth", auth.authentication,  UserController.getUser) 

//=====================================*****user registration to deletion***** ====================
// ======================== to register as a user or admin ========================================
router.post("/registration", UserController.userData);

//===================== log in user/admin ========================================================= 

router.post("/logIn", UserController.logIn);

// ======================user/admin can see his profile ===========================================

router.get("/getUser", auth.authentication, UserController.userDetails); 

//=================== user/admin can update in his profile ========================================

router.put("/updateUser", auth.authentication, UserController.updateUser);

//================= user/admin can delete his profile =============================================

router.delete("/deleteUser", auth.authentication, UserController.deleteUser); 

//==========================*****movie upload to delete*****=======================================

// =================== only admin can upload movies ===============================================

router.post("/saveMovie", auth.authentication, movieController.saveMovie);

// ====================== user/admin can get all the movies =======================================

router.get("/getAllMovies", auth.authentication, movieController.getMovie);

// ========================= user/admin can use some filter to serach the movies ==================

router.get("/getFilterMovies", auth.authentication, movieController.queryMovie);

//================== user can get the movie on movie by movie id  =================================

router.get(
  "/getById/:movieId",
  auth.authentication,
  movieController.getMovieById
);

//============================== only that  admin can delete the movie who uploaded the movie =====
router.delete(
  "/deleteMovie/:movieId",
  auth.authentication,
  movieController.deleteMovie
);
//==============*****add to watchList to delte from watchList*****=================================
// ========================user/admin can add movie in the watchList ==============================
router.post(
  "/addWatchList",
  auth.authentication,
  watchlistContro.addToWatchList 
);
// ============= user/ admin can see all movies with is added in watchList =======================
router.get(
  "/getWatchList",
  auth.authentication,
  watchlistContro.watchlistDetails
);
//================ user/ admin can remove any selected movie from the watchList ===================
router.delete(
  "/deleteMovieWatchList", 
  auth.authentication, 
  watchlistContro.delParticular
);
// ========================user/admin can clear his watchList======================================
router.delete(
  "/clearAllWatchList",
  auth.authentication,
  watchlistContro.clearWatchList 
);
//====================*****review creation to deletion*****========================================
//====================== user/admin can review and rate any selected movie ========================
router.post("/review", auth.authentication, reviewContro.reviewdata);
//================= user/ admin can get his reviews of any particular movie =======================
router.get(
  "/getParticular/:movieId",
  auth.authentication,
  reviewContro.getParticular
);
//================= user/ admin can get all his reviews of all movie  =============================
router.get("/getAllReview", auth.authentication, reviewContro.getAllReviews);
router.put(
  "/reviewUpdate/:movieId",
  auth.authentication,
  reviewContro.updateReview
);
//====================== user/admin can delete any particular reviews of any particular movie======
router.delete(
  "/particularReviewDelete/:movieId",
  auth.authentication,
  reviewContro.DeleteParticular
);
//====================== user/admin can delete all reviews of all movie what is given by him =======
router.delete("/allReviewDelete", auth.authentication, reviewContro.DeleteAll);





//test application
router.get("/", (req, res) => {
  res.send("your application is working ....");
});

module.exports = router;
