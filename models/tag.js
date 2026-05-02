const mongoose = require("mongoose");

exports.tagsSchema = new mongoose.Schema({

    tagName : {
        type : String,
    },

    tagDescription : {
        type : String,
    },

    completedVideos : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Subsection",
        }
    ],
});

module.exports = mongoose.model("tag" , tagsSchema);
