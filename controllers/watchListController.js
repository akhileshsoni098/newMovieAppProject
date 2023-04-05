
const movieModel = require("../models/movieModel");
const moviModel = require("../models/movieModel");
const userModel = require("../models/userModel");
const watchListModel = require("../models/watchListModel");

//===================== get watchList ================================

const watchlistDetails = async function(req,res){

    const userId = req.params.userId

    const watchList = await watchListModel.find({userID:userId}).populate({
        path: "movies",
        model: "Movie"
       
      });

res.status(200).send({status:true, data:watchList})


}


// ============================= delete one by one ========================================

const delParticular = async function(req, res){

    const movieId = req.params.movieId
    const userId = req.params.userId
await watchListModel.findOneAndDelete({movies:movieId})
res.status(200).send({status:true , message:"this movie has been removed from your watch list"})

}

//===================================== clear all watchList =====================================

const clearWatchList = async function(req,res){
    const userId = req.params.userId

await watchListModel.deleteMany({userID:userId})

res.status(200).send({status:true , message:" your watch list is clear now"})

}





module.exports = {watchlistDetails, delParticular, clearWatchList}

























