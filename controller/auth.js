const user = require("../models/user");
const otp = require("../models/OTP");
const otpgen = require("otp-generator");
const { raw } = require("express");
const OTP = require("../models/OTP");


//Send OTP MODEL

exports.sendOTP = async (req,res) => {

    try{

        const {email} = req.body ;  // jo bhi schema hai vo db banna ke liye use hota hai.

        if (!user_email) {
            res.status(400).json({
                success : false,
                message : "Email is required"
            })
        };

        //chceking if this user already exists.?

        //findone syntax .findone({email (//ye schema mai jo email likha tha vo hai ): user_email // email ki value hai mtlb user typed email })

        const check_user = await user.findOne({email}); // user is the model jo ki db se baat krr rha hai so we are querying the db to check 

        if(check_user) {
            res.status(400).json({
                success : false,
                message : "User already exists."
            })
        };

        var generated_otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false , lowerCaseAlphabets : false});

        //unique otp

        let result = await OTP.findOne({otp});

        const otp_payload = {email , otp};

        const otp_body = await OTP.create(otp_payload);
        console.log(otp_body);

        res.status(200).json({
            success : true,
            message : "OTP sent successfully."
        })

    }

    catch(err){
        console.error(err);
        res.status(400).json({
                success : false,
                message : "There is some failure",

    })}}
