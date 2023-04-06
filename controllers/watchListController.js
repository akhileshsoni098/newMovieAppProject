

const moviModel = require("../models/movieModel");
const userModel = require("../models/userModel");
const watchListModel = require("../models/watchListModel");



// ================================================= add watchList ========================================

const addToWatchList = async function(req,res){
    
      let userId = req.userId

       let movieId = req.params.movieId

       const checkWatchList = await watchListModel.findOne({userID:userId , movies:movieId})

if(checkWatchList){return res.status(400).send({status:false , message:"already added in the watchList"})}

       let data = req.body
         let {userID, movies} = data

      userID = data.userID = userId

   movies = data.movies = movieId



await watchListModel.create(data)

res.status(201).send({status:true , message: "Successfully add in the watch List"})
}







// ================================================== get watchList ===========================================

const watchlistDetails = async function(req,res){

    let userId = req.userId

    const watchList = await watchListModel.find({userID:userId}).populate({
        path: "movies",
        model: "Movie"
       
      });

res.status(200).send({status:true, data:watchList})


}


// ============================= delete one by one ========================================

const delParticular = async function(req, res){

    const movieId = req.params.movieId
    let userId = req.userId
 const check =   await watchListModel.findOneAndDelete({movies:movieId, userID:userId})
if(!check){return res.status(404).send({status:false , message:"not found"})}

res.status(200).send({status:true , message:"this movie has been removed from your watch list"})

}

//===================================== clear all watchList =====================================

const clearWatchList = async function(req,res){
    let userId = req.userId

    let watchL =  await watchListModel.findOne({userID:userId})
   
    if(!watchL){return res.status(400).send({status:false , message:"watch list is already empty"})}

   await watchListModel.deleteMany({userID:userId})



res.status(200).send({status:true , message:" your watch list is clear now"})

}





module.exports = {addToWatchList, watchlistDetails, delParticular, clearWatchList}

























