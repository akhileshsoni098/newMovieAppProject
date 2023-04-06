
const movieModel = require("../models/movieModel");
const userModel = require("../models/userModel");
const watchListModel = require("../models/watchListModel");
const reviewModel = require("../models/revieweModel")

//=============================review creation =============================


const reviewdata = async function(req,res){
    const userId = req.params.userId

    const data = req.body

const {review, rating, movies} = data

const checkReviews = await reviewModel.findOne({userID:userId , movies:movies})

if(checkReviews){return res.status(400).send({status:false, message:"already reviwed"})}

const checkMovie = await movieModel.findById(movies)

if(checkMovie.isDeleted == true){return res.status(400).send({status:false, message:"movies does not exist"})}
userID = data.userID = userId

const saveReviwes = await reviewModel.create(data)

res.status(201).send({status:true ,message:"Review created" ,data:saveReviwes})


}
//========================== get Particular review details =========================

const getParticular = async function(req,res){
    const userId = req.params.userId
const movies = req.body.movies

const getMovie = await movieModel.findById(movies)
if(getMovie.isDeleted == true){
    return res.status(400).send({status:false , message:"movie does not exist"})
}

const reviews = await reviewModel.findOne({userID:userId, movies:movies})

const ReviewData = {
    movies:getMovie,
    review:reviews
}

res.status(200).send({status:true, data:ReviewData})

}

// =========================== get all reviews ===========================



const getAllReviews = async function(req,res){
    const userId = req.params.userId

const reviews = await reviewModel.find({userID:userId}).populate("movies")


res.status(200).send({status:true, data:reviews})

}

//============================= Update review ==========================


const updateReview = async function(req, res){
    
    const userId = req.params.userId

    let data = req.body

let {review, rating, movies} = data

const checkMovie = await movieModel.findById(movies)

if(checkMovie.isDeleted == true){return res.status(400).send({status:false, message:"movies does not exist"})}

let updateReviews = await reviewModel.findOneAndUpdate({userID:userId , movies:movies},
    {$set:{review:data.review , rating:data.rating}},{new:true})

res.status(200).send({status:true ,message:"Review updated" , data:updateReviews})

}


// ======================== delete Particular review ====================

const DeleteParticular = async function(req,res){
    const userId = req.params.userId

    const movies = req.body.movies

     await reviewModel.findOneAndDelete({userID:userId , movies:movies},{new:true})


  res.status(200).send({status:true ,message:"Selected Review deleted" })

}
//======================== delete all reviews =======================

const DeleteAll = async function(req,res){
    const userId = req.params.userId

   await reviewModel.deleteMany({userID:userId},{new:true})

  res.status(200).send({status:true ,message:"deleted all Reviews"})

}



module.exports = {reviewdata, getParticular, getAllReviews, updateReview, DeleteParticular, DeleteAll }















