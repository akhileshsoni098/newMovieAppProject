const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const MovieSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    year: {
      type: String,
    },
    imdbID: {
      type: String,
    },
    type: {
      type: String,
    },
    poster: {
      type: String,
    },
    adminID: {
      type: ObjectId,
      ref: "MoviUser",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Movie", MovieSchema);
