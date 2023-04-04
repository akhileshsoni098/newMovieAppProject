const mongoose = require("mongoose")

const ObjectId = mongoose.Schema.Types.ObjectId

const WatchList = mongoose.Schema ({

userId:{
    Type:ObjectId,
    ref:"MoviUser"
},

movieId:{
    type:ObjectId,
    ref:"Movie"
}

})

module.exports = mongoose.model("WatchList", reviewSchema)