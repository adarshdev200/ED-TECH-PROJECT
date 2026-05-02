const mongoose = require("mongoose");

exports.courseprogressSchema = new mongoose.Schema({

    courseID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "course"
    },

    completedVideos : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Subsection",
        }
    ],
});

module.exports = mongoose.model("courseprogress" , courseprogressSchema);
