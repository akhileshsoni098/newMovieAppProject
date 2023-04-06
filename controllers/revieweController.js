
const movieModel = require("../models/movieModel");
const userModel = require("../models/userModel");
const watchListModel = require("../models/watchListModel");
const reviewModel = require("../models/revieweModel")

//=============================review creation =============================


const reviewdata = async function(req, res){

    let userId = req.userId

    let movieId = req.params.movieId

    let data = req.body

let {review, rating, userID, movies} = data
// have to validate rating ...
const checkReviews = await reviewModel.findOne({userID:userId , movies:movieId})

if(checkReviews){return res.status(400).send({status:false, message:"already reviwed"})}

const checkMovie = await movieModel.findById(movieId)

if(checkMovie.isDeleted == true){return res.status(400).send({status:false, message:"movies does not exist"})}

userID = data.userID = userId

movies = data.movies = movieId

const saveReviwes = await reviewModel.create(data)

res.status(201).send({status:true ,message:"Review created successfully" , data:saveReviwes})


}
//========================== get Particular review details =========================

const getParticular = async function(req,res){

let userId = req.userId
console.log(userId)
const movieId = req.params.movieId

const getMovie = await movieModel.findById(movieId)
console.log(getMovie)
if(getMovie.isDeleted == true){
    return res.status(400).send({status:false , message:"movie does not exist"})
}

const reviews = await reviewModel.findOne({userID:userId, movies:movieId})

const ReviewData = {
    movies:getMovie,
    review:reviews
}

res.status(200).send({status:true, data:ReviewData})

}

// =========================== get all reviews ===========================



const getAllReviews = async function(req,res){
    let userId = req.userId

const reviews = await reviewModel.find({userID:userId}).populate("movies")


res.status(200).send({status:true, data:reviews})

}

//============================= Update review ==========================


const updateReview = async function(req, res){
    
    let userId = req.userId
let movieId = req.params.movieId

    let data = req.body

let {review, rating} = data
 

const checkMovie = await movieModel.findById(movieId)

if(checkMovie.isDeleted == true){return res.status(400).send({status:false, message:"movies does not exist"})}

const check = await reviewModel.findOne({movies:movieId, userID:userId})
console.log(check)
if(!check){return res.status(404).send({status:false , message:"No review found"})}



let updateReviews = await reviewModel.findOneAndUpdate({userID:userId , movies:movieId},
    {$set:{review:data.review , rating:data.rating}},{new:true})

res.status(200).send({status:true ,message:"Review updated" , data:updateReviews})

}


// ======================== delete Particular review ====================

const DeleteParticular = async function(req,res){
    let userId = req.userId

    const movieId = req.params.movieId

    let check =    await reviewModel.findOne({userID:userId , movies:movieId})
    if(!check){return res.status(404).send({status:false , message:"No review found to delete"})}
   await reviewModel.findOneAndDelete({userID:userId , movies:movieId},{new:true})

  

  res.status(200).send({status:true ,message:"Selected Review deleted" })

}
//======================== delete all reviews =======================

const DeleteAll = async function(req,res){
let userId = req.userId

 const check = await reviewModel.findOne({userID:userId},{new:true})
 if(!check){return res.status(404).send({status:false , message:" No review found to delete"})}

   await reviewModel.deleteMany({userID:userId},{new:true})

  res.status(200).send({status:true ,message:"deleted all Reviews"})

}



module.exports = {reviewdata, getParticular, getAllReviews, updateReview, DeleteParticular, DeleteAll }















