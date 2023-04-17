const mongoose = require("mongoose")


const movieModel = require("../models/movieModel");
const userModel = require("../models/userModel");
const watchListModel = require("../models/watchListModel");
const reviewModel = require("../models/revieweModel")

//=============================review creation =============================


const reviewdata = async function(req, res){
try{

    let userId = req.userId
    if (!userId) {
      return res.status(401).send({ status: false, message: " log in again " });
    }
    if (!mongoose.isValidObjectId(userId) || !userId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

     let movieId = req.body.movieId
     if (!movieId) {
      return res.status(401).send({ status: false, message: " invalid movie Access " });
    }
    if (!mongoose.isValidObjectId(movieId) || !movieId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

    let data = req.body

let {review, rating, userID, movies} = data 


//======================= review validation ==========

// when user only want to review

if(review){
    if (!data.review) {
        return res
          .status(400)
          .send({ status: false, message: "Please write Something in  review" });
      }
      if (typeof review != "string") {
        return res
          .status(400)
          .send({ status: false, message: "review should be in string" });
      }
      review = data.review = review.trim();
  
      if (review == "") {
        return res
          .status(400)
          .send({ status: false, message: "Please Enter review value" });
      }
    

}

// when user want to rate only ====

if(rating){

    if (!data.rating) {
        return res.status(400).send({ status: false, messsage: "Please provide rating" })
    }
    if ( typeof rating != "number") {
        return res.status(400).send({ status: false, messsage: "Please provide rating in number" })
    }
    
            if (rating < 1 || rating > 5) {
                return res.status(400).send({ status: false, messsage: "Please provide rating 1 to 5" })
            }
}

const checkReviews = await reviewModel.findOne({userID:userId , movies:movieId})

if(checkReviews){return res.status(400).send({status:false, message:"already reviwed"})}

const checkMovie = await movieModel.findById(movieId)
if(!checkMovie){return res.status(400).send({status:false, message:" not found !"})}

if(checkMovie.isDeleted == true){return res.status(400).send({status:false, message:"movies does not exist"})}

userID = data.userID = userId

movies = data.movies = movieId

const saveReviwes = await reviewModel.create(data)

res.status(201).send({status:true ,message:"Review created successfully" , data:saveReviwes})

}catch(err){
    return res.status(500).send({status:false , message:err.message})
}
}


//========================== get Particular review details =========================

const getParticular = async function(req,res){
try{
    let userId = req.userId
    if (!userId) {
      return res.status(401).send({ status: false, message: " log in again " });
    }
    if (!mongoose.isValidObjectId(userId) || !userId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

     let movieId = req.body.movieId
     if (!movieId) {
      return res.status(401).send({ status: false, message: " invalid movie Access " });
    }
    if (!mongoose.isValidObjectId(movieId) || !movieId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

const getMovie = await movieModel.findById(movieId)

if(!getMovie){
    return res.status(400).send({status:false , message:"movie does not exist"})
}
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
}catch(err){
    res.status(500).send({status:false , message:err.message})
}
}

// =========================== get all reviews ===========================



const getAllReviews = async function(req,res){
try{

    let userId = req.userId
    if (!userId) {
      return res.status(401).send({ status: false, message: " log in again " });
    }
    if (!mongoose.isValidObjectId(userId) || !userId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

const reviews = await reviewModel.find({userID:userId}).populate("movies")


res.status(200).send({status:true, data:reviews})
}catch(err){
    res.status(500).send({status:false , message:err.message})
}
}

//============================= Update review ==========================




const updateReview = async function(req, res){
    
   try{
    let userId = req.userId

    if (!userId) {
      return res.status(401).send({ status: false, message: " log in again " });
    }
    if (!mongoose.isValidObjectId(userId) || !userId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

     let movieId = req.body.movieId
     if (!movieId) {
      return res.status(401).send({ status: false, message: " invalid movie Access " });
    }
    if (!mongoose.isValidObjectId(movieId) || !movieId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

    let data = req.body

let {review, rating} = data
 

// when user only want to review

if(review){
    if (!data.review) {
        return res
          .status(400)
          .send({ status: false, message: "Please write Something in  review" });
      }
      if (typeof review != "string") {
        return res
          .status(400)
          .send({ status: false, message: "review should be in string" });
      }
      review = data.review = review.trim();
  
      if (review == "") {
        return res
          .status(400)
          .send({ status: false, message: "Please Enter review value" });
      }
}

// when user want to rate only ====

if(rating){

    if (!data.rating) {
        return res.status(400).send({ status: false, messsage: "Please provide rating" })
    }
    if ( typeof rating != "number") {
        return res.status(400).send({ status: false, messsage: "Please provide rating in number" })
    }
    
            if (rating < 1 || rating > 5) {
                return res.status(400).send({ status: false, messsage: "Please provide rating 1 to 5" })
            }
}

const checkMovie = await movieModel.findById(movieId)

if(!checkMovie){return res.status(404).send({status:false , messsage:"Movie not found"})}

if(checkMovie.isDeleted == true){return res.status(400).send({status:false, message:"movies does not exist"})}

const check = await reviewModel.findOne({movies:movieId, userID:userId})

if(!check){return res.status(404).send({status:false , message:"No review found on this movie to update"})}

let updateReviews = await reviewModel.findOneAndUpdate({userID:userId , movies:movieId},
    {$set:{review:data.review , rating:data.rating}},{new:true})

res.status(200).send({status:true ,message:"Review updated" , data:updateReviews})
   }catch(err){
    return res.status(500).send({status:false , message:err.message})
   }
}


// ======================== delete Particular review ====================

const DeleteParticular = async function(req,res){
try{
    let userId = req.userId

    if (!userId) {
      return res.status(401).send({ status: false, message: " log in again " });
    }
    if (!mongoose.isValidObjectId(userId) || !userId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

     let movieId = req.body.movieId
     if (!movieId) {
      return res.status(401).send({ status: false, message: " invalid movie Access " });
    }
    if (!mongoose.isValidObjectId(movieId) || !movieId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

    const checkMovie = await movieModel.findById(movieId)

    if(!checkMovie){return res.status(404).send({status:false , messsage:"Movie not found"})}
    
    if(checkMovie.isDeleted == true){return res.status(400).send({status:false, message:"movies does not exist"})}
    
    let check = await reviewModel.findOne({userID:userId , movies:movieId})

    if(!check){return res.status(404).send({status:false , message:"No review found of yours on this movie"})}

   await reviewModel.findOneAndDelete({userID:userId , movies:movieId},{new:true})

  res.status(200).send({status:true ,message:"Selected Review deleted" })
}catch(err){
    return res.status(500).send({status:false , message:err.message})
   }
}


//======================== delete all reviews =======================

const DeleteAll = async function(req,res){
try{
    let userId = req.userId
    if (!userId) {
      return res.status(401).send({ status: false, message: " log in again " });
    }
    if (!mongoose.isValidObjectId(userId) || !userId) {
      return res.status(400).send({ status: false, message: " Invalid Entry" });
    }

 const check = await reviewModel.findOne({userID:userId},{new:true})
 if(!check){return res.status(404).send({status:false , message:" No review found to delete"})}

   await reviewModel.deleteMany({userID:userId},{new:true})

  res.status(200).send({status:true ,message:"deleted all Reviews"})
}catch(err){
    return res.status(500).send({status:false , message:err.message})
   }
}



module.exports = {reviewdata, getParticular, getAllReviews, updateReview, DeleteParticular, DeleteAll }















