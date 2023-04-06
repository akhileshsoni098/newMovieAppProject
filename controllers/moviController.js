const movieModel = require("../models/movieModel");
const moviModel = require("../models/movieModel");
const userModel = require("../models/userModel");

const reviewModel = require("../models/revieweModel")


const axios = require("axios");
const watchListModel = require("../models/watchListModel");


// ================================= save movie ==================================


const OMDB_API_KEY = "8cb4187"; // http://www.omdbapi.com/?i=tt3896198&apikey=8cb4187

const saveMovie = async function (req, res) {
  try {
    const adminId = req.params.adminId;

    const checkAdmin = await userModel.findById(adminId);

    if (checkAdmin.role !== "admin") {
      return res
        .status(400)
        .send({ status: false, message: "Only Admin can upload movie" });
    }
    let dataB = req.body;

    let { title, year, imdbID, type, poster, adminID } = dataB; // removeable

    adminID = dataB.adminID = adminId
    
    const response = await axios.get(
      `http://www.omdbapi.com/?i=tt3896198&apikey=${OMDB_API_KEY}`
    );
    const data = response.data;

    // console.log(data);
    const movie = {
      title: data.Title,
      year: data.Year,
      imdbID: data.imdbID,
      type: data.Type,
      poster: data.Poster, 
      adminID:adminId
    };
console.log(movie)
    const moviData = await moviModel.create(movie);
    res
      .status(201)
      .send({
        status: true,
        message: "Movie saved successfully",
        data: moviData,
      });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};



//  ===================================== get movie by Query if no query showing all movie ===========================================

const getMovie = async function(req,res){

  const userId = req.body.userId
const data = req.query
const {title,year,type } = data
if(!title || !year || !type){
  const movies = await movieModel.find({isDeleted:false})
  return res.status(200).send({status:true , data:movies})
}
 
if(title || year || type){
const Query = await movieModel.find({title:title, year:year , type:type},{isDeleted:false})

return res.status(200).send({status:true , data:Query})

}

}

//============================== get movie by MovieId ==========================================


const getMovieById = async function(req, res){

  const userId = req.params.userId
  const movieId = req.params.movieId
  let data = req.body
let {userID , movies} = data
  userID = data.userID = userId
   movies = data.movies = movieId
  const getMovie = await movieModel.findById(movieId)
  if(getMovie.isDeleted==false){return res.status(400).send({status:false , message:"this movie does not exist"})}
 
const checkWatchList = await watchListModel.findOne({userID:userId, movies:movieId})
if(!checkWatchList){
  // here i am adding movies in watchList for each different user 
  await watchListModel.create(data)
  // doubt in this part that same time i should to refer userId and movie id to review collection or not
  await reviewModel.create(data) 
}
const revieweDetails = await reviewModel.find({movies:movieId})

const details = {
  
movie: getMovie,

review:revieweDetails

}
return res.status(200).send({status:false , data:details})

}



//==================================  delete movies ====================================

const deleteMovie = async function(req,res){  
  // admin can be more Than one so i have to authorise the user who
  //  saved the video only that admin can  delete the movie

  const userId = req.params.userId
  const movieId = req.params.movieId
const checkUser = await userModel.findById(userId)
if(checkUser.role != "admin"){return res.status(400).send({status:false , message:"Only admin can delete movie"})}

await movieModel.findOneAndUpdate({_id:movieId,isDeleted:false},{isDeleted:true},{new:true})
 await watchListModel.findOneAndDelete({movies:movieId})
// agr video hi delete ho gya h toh watchId/ wachlist se bhi delete ho jayegi...
await reviewModel.findOneAndDelete({movies:movieId}) // yaha find hi nhi hogi store q krna

res.status(200).send({status:true , message:"deleted successfully"})

}











module.exports = { saveMovie, getMovie , getMovieById, deleteMovie };
