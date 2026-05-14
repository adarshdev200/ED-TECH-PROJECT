const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

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

    active: {
			type: Boolean,
			default: true,
		},

    approved: {
			type: Boolean,
			default: true,
		},

    image : {

        type : String,
        required : true,
    },

    token : {
        type : String,
    },

    resetPasswordExpires : {
        type : Date,

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


},
{ timestamps: true });

module.exports = mongoose.model("user" , userSchema);
