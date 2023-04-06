const movieModel = require("../models/movieModel");
const userModel = require("../models/userModel");
const reviewModel = require("../models/revieweModel")


const axios = require("axios");
const watchListModel = require("../models/watchListModel");


// ================================= save movie ==================================


const OMDB_API_KEY = "8cb4187"; // http://www.omdbapi.com/?i=tt3896198&apikey=8cb4187

const saveMovie = async function (req, res) {
  try {
    let userId =  req.userId ;

    const checkAdmin = await userModel.findById(userId);
console.log(checkAdmin)
    if (checkAdmin.role !== "admin") {
      return res
        .status(400)
        .send({ status: false, message: "Only Admin can upload movie" });
    }
      
    if(checkAdmin.isDeleted == true){
      return res
        .status(400)
        .send({ status: false, message: " Admin is not exist" });
    }

    let dataB = req.body;

    let { title, year, imdbID, type, poster, adminID } = dataB; // removeable

    adminID = dataB.adminID = userId
    
    const response = await axios.get(
      `http://www.omdbapi.com/?t=${req.body.title}&apikey=${OMDB_API_KEY}`
    );
    const data = response.data;
console.log(data)
    // console.log(data);
    const movie = {
      title: data.Title,
      year: data.Year,
      imdbID: data.imdbID,
      type: data.Type,
      poster: data.Poster, 
      adminID:userId
    };
console.log(movie)
    const moviData = await movieModel.create(movie);
    res
      .status(201)
      .send({
        status: true,
        message: "Movie saved successfully",
        data: moviData,
      });
  } catch (err) {
    res.status(500).send({status:false , message:err.message});
  }
};



//  ===================================== get movie by Query if no query showing all movie ===========================================

const getMovie = async function(req,res){  

  let userId =  req.userId 

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

  const movieId = req.params.movieId
  
  const getMovie = await movieModel.findById(movieId)
 
const revieweDetails = await reviewModel.find({movies:movieId})

const details = {
  
movie: getMovie,

review:revieweDetails

}

return res.status(200).send({status:false , data:details})

}



//==================================  delete movies ====================================

const deleteMovie = async function(req,res){  

  let userId =  req.userId 
console.log(userId)
  const movieId = req.params.movieId

// Checking admin or not
const checkUser = await userModel.findById(userId)

if(checkUser.role != "admin"){return res.status(400).send({status:false , message:"Only admin can delete movie"})}

if(checkUser.isDeleted == true){return res.status(400).send({status:false , message:" user not found"})}

// checking same user or not 

const authorization = await movieModel.findById(movieId)

if(authorization.adminID != userId){return res.status(403).send({status:false , message:"Unathorized Access" })}
if(authorization.isDeleted == true){return res.status(400).send({status:false , message:" movie doesn't exist "})}
// soft delete of movie
await movieModel.findOneAndUpdate({_id:movieId,isDeleted:false},{isDeleted:true},{new:true})

// deleting from watchList 
 await watchListModel.findOneAndDelete({movies:movieId})
// deleting review of that movie from db
await reviewModel.findOneAndDelete({movies:movieId}) 

res.status(200).send({status:true , message:"deleted successfully"})

} 











module.exports = { saveMovie, getMovie , getMovieById, deleteMovie };
