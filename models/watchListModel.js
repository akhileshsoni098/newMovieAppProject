const mongoose = require("mongoose")

const ObjectId = mongoose.Schema.Types.ObjectId

const WatchList = mongoose.Schema ({

userID:{
    type:ObjectId,
    ref:"MoviUser"
},

movies:{
    type:ObjectId,
    ref:"Movie"
},

// direct delete (hard delete)

})

module.exports = mongoose.model("WatchList", WatchList)