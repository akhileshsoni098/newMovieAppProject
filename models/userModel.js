const { default: mongoose } = require("mongoose");




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
 
isDeleted:{
    type:Boolean,
    default:false
},
deletedAt:{
    type:Date,
    default:false
}


}, {timeStamp:true})

module.exports =  UserSchema


