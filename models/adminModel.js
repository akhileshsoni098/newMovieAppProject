const mongoose = require("mongoose")

// admin can upload movie

const UserSchema = mongoose.Schema ({


fname:{
    type:String,
    required:true
    
},
lname:{
    type:String,
    required:true
    
},
email:{
    type:String, 
    required:true,
    unique:true

 },
 password:{
    type:String,
    required:true
 },
 status:{
    Type:String,
    default:"admin"
 }

}, {timeStamp:true})

module.exports = mongoose.model("Admin", UserSchema)


