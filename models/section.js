const mongoose = require("mongoose");

exports.sectionScehma = new mongoose.Schema({

    sectionName : {
        type : String,
    },

    Subsection : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "subsection",
        }
    ],
});

module.exports = mongoose.model("section" , sectionScehma);
