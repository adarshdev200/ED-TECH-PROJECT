const mongoose = require("mongoose");

require("dotenv").config();

const dbConnect = () =>  {
    mongoose.connect(process.env.DATABASE_URL )

    .then(() => console.log("Connection was succesful !! "))
    .catch((error)=> {
        console.log("Error aagyaa");
        console.error(error.message);
        process.exit(1);
    });
}

module.exports = dbConnect;

