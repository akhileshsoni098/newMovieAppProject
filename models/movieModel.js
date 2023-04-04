const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const MovieSchema = mongoose.Schema({

title:{
    type:String,
    required:true,
    unique:true
},
movieType:{
    type:String,
    enum:["Action", "Comedy" ,"Drama","Fantasy","Horror","Mystery","Romance","Thriller"],
required:true
},
adminId:{
    type:ObjectId,
    ref:"Admin"
},

releasedAt:{
    type:Date,
    default:Date.now()
},
isDeleted:{
    type:Boolean,
    default:false
},
deletedAt:{
    type:Date,
    default:false
}

}, {timeStamp:true})

module.exports = mongoose.model("Movie", MovieSchema)




