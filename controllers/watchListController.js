
const movieModel = require("../models/movieModel");
const moviModel = require("../models/movieModel");
const userModel = require("../models/userModel");
const watchListModel = require("../models/watchListModel");


const watchlistDetails = async function(req,res){

    const userId = req.params.userId

    const watchList = await watchListModel.find({userID:userId}).populate("movieID")

res.status(200).send({status:true, data:watchList})


}




const delParticular = async function(req, res){

    const movieId = req.params.movieId
    const userId = req.params.userId
await watchListModel.findOneAndDelete({movieID:movieId})
res.status(200).send({status:true , message:"this movie has been removed from your watch list"})

}



const clearWatchList = async function(req,res){
    const userId = req.params.userId

await watchListModel.deleteMany({userID:userId})

res.status(200).send({status:true , message:" your watch list is clear now"})

}





module.exports = {watchlistDetails, delParticular, clearWatchList}

























