const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({

    gender :{
        type : String,
        trim : true,
    },

    dateofbirth :{
        type : String,
        trim : true,
    },

    about : {
        type : String,
        trim : true
    },

    contactnumber : {
        type : Number,
    },

    

});

module.exports = mongoose.model("profile" , profileSchema);
