var mongoose = require("mongoose");

// Schema for campgrounds
var campSchema = new mongoose.Schema({
    name: String,
    price: String,
    likes: Number,
    dislikes: Number,
    image: String,
    location: String,
    lat: Number,
    lng: Number,
    createdAt: {type: Date , default: Date.now},
    description: String,
    author: {
      id:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"                              // Model's Name
        }
    ]
});

module.exports = mongoose.model("Camp", campSchema);