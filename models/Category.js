const mongoose = require("mongoose");

exports.tagsSchema = new mongoose.Schema({

    tagName : {
        type : String,
    },

    tagDescription : {
        type : String,
    },

    course : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "course",
        }
    ],
});

module.exports = mongoose.model("tag" , tagsSchema);
