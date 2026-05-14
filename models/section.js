const mongoose = require("mongoose");

const sectionScehma = new mongoose.Schema({

    sectionName : {
        type : String,
    },

    Subsection : [
        {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "subsection",
        }
    ],
});

module.exports = mongoose.model("section" , sectionScehma);
