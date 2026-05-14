const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

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

module.exports = mongoose.model("Category" , categorySchema);
