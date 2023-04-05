const { default: mongoose } = require("mongoose");




const UserSchema = new mongoose.Schema ({
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
 role: {
    type: String,
    enum: ["admin", "user"],
    default:"user"
 },
isDeleted:{
    type:Boolean,
    default:false
},

deletedAt:{
    type:Date,

}


}, {timeStamp:true})

module.exports =  mongoose.model("MoviUser", UserSchema)


