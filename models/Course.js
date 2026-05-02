const mongoose = require("mongoose");

exports.CourseSchema = new mongoose.Schema({

    courseName : {
        type : String,
    },

    courseDescription : {
        type : String,
    },

    whatwillyoulearn : {
        type : String,
    },
    
    price : {
        type : Number,

    },

    coursecontent : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "section",
        }
    ],

    instructor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true,
    },

    ratingAndReviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "ratingAndReviews",

        }
    ],

    thumbNail : {
        type : String,
    },

    Tags : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "tag",
    },

    studentsEnrolled : [
        {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "users"
        }
    ]

});

module.exports = mongoose.model("course" , CourseSchema);
