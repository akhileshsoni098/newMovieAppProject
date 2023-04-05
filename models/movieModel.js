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
    required:true,
    enum:["Action", "Comedy" ,"Drama","Fantasy","Horror","Mystery","Romance","Thriller"],

},
adminId:{       // going save whoes id who is registerd as a admin
    type:ObjectId,
    ref:"MoviUser"
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




