const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;


const MovieSchema = mongoose.Schema({
  title: { 
    type: String,
     required: true
     },
  year: { 
    type: String 
},
  imdbID: { 
    type: String,
     required: true 
    },
  type: { 
    type: String
 },
  poster: { 
    type: String 
},
  adminID: {
    type: ObjectId,
    ref: "MoviUser",
  },

isDeleted:{
  type:Boolean,
  default:false
}


});

module.exports = mongoose.model("Movie", MovieSchema);
