const mongoose = require("mongoose");
const mailSender = require("../utils/nodemailer");

const OTPSchema = new mongoose.Schema({

    email:{
        type:String,
        required: true,
    },

    otp : {
        type : Number,
        required : true,
    },

    createdAt : {
        type : Date,
        default : Date.now,
        expires : 5 * 60,

    },

});


// a function -> to send emails
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Verification Email from StudyNotion", otp);
        console.log("Email sent Successfully: ", mailResponse);
    }
    catch(error) {
        console.log("error occured while sending mails: ", error);
        throw error;
    }
}

OTPSchema.pre("save", async function() {
    await sendVerificationEmail(this.email, this.otp);  
    
})

// It's a listener that says: "Hey Mongoose, whenever someone tries to save an OTP, run this code FIRST (before the actual save)."

module.exports = mongoose.model("OTP" , OTPSchema);

