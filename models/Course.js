const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({

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

    category : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Category",
    },

    tag: {
		type: [String],
		required: true,
	},

    instructions: {
		type: [String],
	},

    studentsEnrolled : [
        {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "users"
        }
    ],

    status: {
		type: String,
		enum: ["Draft", "Published"],
	},

});

module.exports = mongoose.model("course" , CourseSchema);
