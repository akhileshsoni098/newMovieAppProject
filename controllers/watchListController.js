const mongoose = require("mongoose");

const movieModel = require("../models/movieModel");
const userModel = require("../models/userModel");
const watchListModel = require("../models/watchListModel");

// ================================================= add watchList ========================================

const addToWatchList = async function (req, res) {
  try {
    let userId = req.userId;
    if (!userId) {
      return res.status(401).send({ status: false, message: " log in again " });
    }
    if (!mongoose.isValidObjectId(userId) || !userId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

    let movieId = req.params.movieId;
    if (!movieId) {
      return res
        .status(401)
        .send({ status: false, message: " invalid movie Access " });
    }
    if (!mongoose.isValidObjectId(movieId) || !movieId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

    const checkMovie = await movieModel.findOne({
      _id: movieId,
      isDeleted: false,
    });
    if (!checkMovie) {
      return res
        .status(400)
        .send({ status: false, message: "This movie does not exist" });
    }

    const checkWatchList = await watchListModel.findOne({
      userID: userId,
      movies: movieId,
    });

    if (checkWatchList) {
      return res
        .status(400)
        .send({ status: false, message: "already added in the watchList" });
    }

    let data = req.body;

    let { userID, movies } = data;

    userID = data.userID = userId;

    movies = data.movies = movieId;

    await watchListModel.create(data);

    res
      .status(201)
      .send({ status: true, message: "Successfully add in the watch List" });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// ================================================== get watchList ===========================================

const watchlistDetails = async function (req, res) {
  try {
    let userId = req.userId;
    if (!userId) {
      return res.status(401).send({ status: false, message: " log in again " });
    }
    if (!mongoose.isValidObjectId(userId) || !userId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }
    const watchList = await watchListModel.find({ userID: userId }).populate({
      path: "movies",
      model: "Movie",
    });

    res.status(200).send({ status: true, data: watchList });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// ============================= delete one by one ========================================

const delParticular = async function (req, res) {
  try {
    let userId = req.userId;
    if (!userId) {
      return res.status(401).send({ status: false, message: " log in again " });
    }
    if (!mongoose.isValidObjectId(userId) || !userId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

    let movieId = req.params.movieId;
    if (!movieId) {
      return res
        .status(401)
        .send({ status: false, message: " invalid movie Access " });
    }
    if (!mongoose.isValidObjectId(movieId) || !movieId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

    let check = await watchListModel.findOne({
      movies: movieId,
      userID: userId,
    });
    if (!check) {
      return res
        .status(404)
        .send({
          status: false,
          message: " this movie is not present in your watchList ",
        });
    }

    await watchListModel.findOneAndDelete({ movies: movieId, userID: userId });

    res
      .status(200)
      .send({
        status: true,
        message: "this movie has been removed from your watch list",
      });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//===================================== clear all watchList =====================================

const clearWatchList = async function (req, res) {
  try {
    let userId = req.userId;

    if (!userId) {
      return res.status(401).send({ status: false, message: " log in again " });
    }
    if (!mongoose.isValidObjectId(userId) || !userId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

    let watchL = await watchListModel.findOne({ userID: userId });

    if (!watchL) {
      return res
        .status(400)
        .send({ status: false, message: "watch list is already empty" });
    }

    await watchListModel.deleteMany({ userID: userId });

    res
      .status(200)
      .send({ status: true, message: " your watch list is clear now" });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  addToWatchList,
  watchlistDetails,
  delParticular,
  clearWatchList,
};
