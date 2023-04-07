const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/userController");
const movieController = require("../../controllers/moviController");
const watchlistContro = require("../../controllers/watchListController");
const reviewContro = require("../../controllers/revieweController");

const auth = require("../../middi/auth");

// user and admin both
router.post("/registration", UserController.userData);
router.post("/logInUser", UserController.logIn);
router.get("/getUser", auth.authentication, UserController.userDetails);
router.put("/updateUser", auth.authentication, UserController.updateUser);
router.delete("/deleteUser", auth.authentication, UserController.deleteUser);
// delete user # have to create

// movie

router.post("/saveMovie", auth.authentication, movieController.saveMovie);
router.get("/getAllMovies", auth.authentication, movieController.getMovie);
router.get("/getFilterMovies", auth.authentication, movieController.queryMovie);
router.get(
  "/getById/:movieId",
  auth.authentication,
  movieController.getMovieById
);
router.delete(
  "/deleteMovie/:movieId",
  auth.authentication,
  movieController.deleteMovie
);

// watchList
router.post(
  "/addWatchList/:movieId",
  auth.authentication,
  watchlistContro.addToWatchList
);
router.get(
  "/getWatchList",
  auth.authentication,
  watchlistContro.watchlistDetails
);
router.delete(
  "/deleteMovieWatchList/:movieId",
  auth.authentication,
  watchlistContro.delParticular
);
router.delete(
  "/clearAllWatchList",
  auth.authentication,
  watchlistContro.clearWatchList
);

//review
router.post("/review/:movieId", auth.authentication, reviewContro.reviewdata);
router.get(
  "/getParticular/:movieId",
  auth.authentication,
  reviewContro.getParticular
);
router.get("/getAllReview", auth.authentication, reviewContro.getAllReviews);
router.put(
  "/reviewUpdate/:movieId",
  auth.authentication,
  reviewContro.updateReview
);
router.delete(
  "/particularReviewDelete/:movieId",
  auth.authentication,
  reviewContro.DeleteParticular
);
router.delete("/allReviewDelete", auth.authentication, reviewContro.DeleteAll);

//test application
router.get("/", (req, res) => {
  res.send("your application is working ....");
});

module.exports = router;
