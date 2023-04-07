const mongoose = require("mongoose");

const movieModel = require("../models/movieModel");
const userModel = require("../models/userModel");
const reviewModel = require("../models/revieweModel");
const validation = require("../validattion/validation");

const axios = require("axios");
const watchListModel = require("../models/watchListModel");

// ================================= save movie ==================================

const OMDB_API_KEY = "8cb4187"; // http://www.omdbapi.com/?i=tt3896198&apikey=8cb4187

const saveMovie = async function (req, res) {
  try {
    let userId = req.userId;

    if (!userId) {
      return res.status(401).send({ status: false, message: " log in again " });
    }
    if (!mongoose.isValidObjectId(userId) || !userId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

    const checkAdmin = await userModel.findById(userId);

    if (checkAdmin.role !== "admin") {
      return res
        .status(400)
        .send({ status: false, message: "Only Admin can upload movie" });
    }

    if (checkAdmin.isDeleted == true) {
      return res
        .status(400)
        .send({ status: false, message: " Admin is not exist" });
    }

    let dataB = req.body;

    let { title, year, imdbID, type, poster, adminID } = dataB; // removeable

    adminID = dataB.adminID = userId;

    if (!title) {
      return res
        .status(400)
        .send({ status: false, message: " movie title is required " });
    }

    if (typeof title != "string") {
      return res
        .status(400)
        .send({ status: false, message: " movie title should be in string " });
    }
    title = dataB.title = title.trim();
    if (title == "") {
      return res
        .status(400)
        .send({ status: false, message: "Please provide movie title" });
    }

    // validation  regex

    // if(!validation.validateTitle(title)){return res.status(400).send({status:false , message:"Please provide valid movie name"})}

    const response = await axios.get(
      `http://www.omdbapi.com/?t=${req.body.title}&apikey=${OMDB_API_KEY}`
    );
    const data = response.data;
    // console.log(data)
    if (!data.Title) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide valid title ...!" });
    }

    let isExistMovie = await movieModel.findOne({
      title: data.Title,
      isDeleted: false,
    });
    // console.log(isExistMovie)
    if (isExistMovie) {
      return res
        .status(400)
        .send({ status: false, message: " This movie is already exist" });
    }

    const movie = {
      title: data.Title,
      year: data.Year,
      imdbID: data.imdbID,
      type: data.Type,
      poster: data.Poster,
      adminID: userId,
    };
    // console.log(movie)
    const moviData = await movieModel.create(movie);
    res.status(201).send({
      status: true,
      message: "Movie saved successfully",
      data: moviData,
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//  ===================================== get all movies ===========================================

const getMovie = async function (req, res) {
  try {
    let userId = req.userId;
    if (!userId) {
      return res.status(401).send({ status: false, message: " log in again " });
    }
    if (!mongoose.isValidObjectId(userId) || !userId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

    const movies = await movieModel.find({ isDeleted: false });
    res.status(200).send({ status: true, data: movies }).count;
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//================================== get movie by filter  =============================================================

const queryMovie = async function (req, res) {
  try {
    let userId = req.userId;

    // validation
    if (!userId) {
      return res.status(401).send({ status: false, message: " log in again " });
    }
    if (!mongoose.isValidObjectId(userId) || !userId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

    let data = req.query;

    let { title, year } = data;

    // noting in query....

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Provide Input to search Movies" });
    }

    // if title && year both present in query

    if (title && year) {
      if (!data.title) {
        return res
          .status(400)
          .send({ status: false, message: " movie title is required " });
      }

      if (typeof title != "string") {
        return res
          .status(400)
          .send({
            status: false,
            message: " movie title should be in string ",
          });
      }
      title = data.title = title.trim();
      if (title == "") {
        return res
          .status(400)
          .send({ status: false, message: "Please provide movie title" });
      }

      if (!data.year) {
        return res
          .status(400)
          .send({ status: false, message: " movie year is required " });
      }

      if (typeof year != "string") {
        return res
          .status(400)
          .send({ status: false, message: " movie year should be in string " });
      }
      year = data.year = year.trim();
      if (year == "") {
        return res
          .status(400)
          .send({ status: false, message: "Please provide movie year" });
      }

      const Query = await movieModel.find({
        title: title,
        year: year,
        isDeleted: false,
      });

      if (Query.length == 0) {
        return res
          .status(404)
          .send({ status: false, message: "no movie found by this filter" });
      }
      console.log(" title & year   ");
      res.status(200).send({ status: true, data: Query });
    }

    // title or year  present

    if (title || year) {
      // title
      if (title) {
        if (!data.title) {
          return res
            .status(400)
            .send({ status: false, message: " movie title is required " });
        }

        if (typeof title != "string") {
          return res
            .status(400)
            .send({
              status: false,
              message: " movie title should be in string ",
            });
        }
        title = data.title = title.trim();
        if (title == "") {
          return res
            .status(400)
            .send({ status: false, message: "Please provide movie title" });
        }

        const Query = await movieModel.find({ title: title, isDeleted: false });
        console.log("title");
        if (Query.length == 0) {
          return res
            .status(404)
            .send({ status: false, message: "no movie found by this filter" });
        }
        return res.status(200).send({ status: true, data: Query });
      }
      // year
      if (year) {
        if (!data.year) {
          return res
            .status(400)
            .send({ status: false, message: " movie year is required " });
        }

        if (typeof year != "string") {
          return res
            .status(400)
            .send({
              status: false,
              message: " movie year should be in string ",
            });
        }
        year = data.year = year.trim();
        if (year == "") {
          return res
            .status(400)
            .send({ status: false, message: "Please provide movie year" });
        }

        const Query = await movieModel.find({ year: year, isDeleted: false });
        console.log("year");
        if (Query.length == 0) {
          return res
            .status(404)
            .send({ status: false, message: "no movie found by this filter" });
        }
        return res.status(200).send({ status: true, data: Query });
      }
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//============================== get movie by MovieId ==========================================

const getMovieById = async function (req, res) {
  try {
    let userId = req.userId;

    // validation
    if (!userId) {
      return res.status(401).send({ status: false, message: " log in again " });
    }
    if (!mongoose.isValidObjectId(userId) || !userId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

    const movieId = req.params.movieId;

    if (!movieId) {
      return res
        .status(401)
        .send({ status: false, message: " Provide valid movie " });
    }
    if (!mongoose.isValidObjectId(movieId) || !movieId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

    const getMovie = await movieModel.findById(movieId);

    const revieweDetails = await reviewModel.find({ movies: movieId });

    if (revieweDetails.length == 0) {
      return res.status(200).send({ status: false, data: getMovie });
    } // have to test after  reviewed
    else {
      const details = {
        movie: getMovie,

        review: revieweDetails,
      };

      res.status(200).send({ status: false, data: details });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//==================================  delete movies ====================================

const deleteMovie = async function (req, res) {
  try {
    let userId = req.userId;
    // console.log(userId)
    if (!userId) {
      return res.status(401).send({ status: false, message: " log in again " });
    }
    if (!mongoose.isValidObjectId(userId) || !userId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

    const movieId = req.params.movieId;
    if (!movieId) {
      return res
        .status(401)
        .send({ status: false, message: " invalid movie Access " });
    }
    if (!mongoose.isValidObjectId(movieId) || !movieId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

    // Checking admin or not and deleted or not

    const checkUser = await userModel.findById(userId);

    if (checkUser.role != "admin") {
      return res
        .status(400)
        .send({ status: false, message: "Only admin can delete movie" });
    }

    if (checkUser.isDeleted == true) {
      return res
        .status(400)
        .send({ status: false, message: " user not found" });
    }

    // checking same user who saved movie

    const authorization = await movieModel.findById(movieId);
    if (!authorization) {
      return res
        .status(404)
        .send({ status: false, message: "movie not found" });
    }
    if (authorization.adminID != userId) {
      return res
        .status(403)
        .send({ status: false, message: "Unathorized Access" });
    }
    if (authorization.isDeleted == true) {
      return res
        .status(400)
        .send({ status: false, message: " movie doesn't exist " });
    }
    // soft delete of movie
    await movieModel.findOneAndUpdate(
      { _id: movieId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    // deleting from watchList
    await watchListModel.findOneAndDelete({ movies: movieId });
    // deleting review of that movie from db
    await reviewModel.findOneAndDelete({ movies: movieId });

    res.status(200).send({ status: true, message: "deleted successfully" });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { saveMovie, getMovie, queryMovie, getMovieById, deleteMovie };
