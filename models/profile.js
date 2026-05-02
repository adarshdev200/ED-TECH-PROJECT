const mongoose = require("mongoose");

exports.profileSchema = new mongoose.Schema({

    gender :{
        type : String,
        required : true,
        trim : true,
    },

    dateofbirth :{
        type : String,
        required : true,
        trim : true,
    },

    about : {
        type : String,
        required : true,
        trim : true
    },

    contactnumber : {
        type : Number,
        required : true,
    },

    

});

module.exports = mongoose.model("profile" , profileSchema);
