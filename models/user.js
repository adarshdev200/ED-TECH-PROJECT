const mongoose = require("mongoose");

exports.userSchema = new mongoose.Schema({

    firstName :{
        type : String,
        required : true,
        trim : true,
    },

    lastName :{
        type : String,
        required : true,
        trim : true,
    },

    email : {
        type : String,
        required : true,
    },

    contactnumber : {
        type : Number,
        required : true,
    },

    password : {
        type : String,
        required : true,
    },
    
    acctype : {

        type : String,
        required : true,
        enum : ["Instructor" , "Student" , "Admin"],
    },

    image : {

        type : String,
        required : true,
    },

    courses : [
        {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "course"

        }
    ],

    courseprogress : [

        {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "courseprogress"
        }
    ],
    
    additionaldetails : {

        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "profile"

    },


});

module.exports = mongoose.model("user" , userSchema);
