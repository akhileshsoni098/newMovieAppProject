const mongoose = require("mongoose")

const ObjectId = mongoose.Schema.Types.ObjectId
const reviewSchema = mongoose.Schema({

// jb user kuch dekh chuka hoga then review and rate krega ....

userID:{
    type:ObjectId,
    ref:"MoviUser"
},

movies:{
    type:ObjectId,
    required:true,
    ref:"Movie"
},
review: {
    type: String,
    default: null
  },
rating: {
    type: Number,
    default: 0
  }

 

// by this i can access movie what is watched by user and user data ...


})
module.exports = mongoose.model("Review", reviewSchema)


