const user = require("../models/user");
const otp = require("../models/OTP");
const otpgen = require("otp-generator");
const { raw } = require("express");
const OTP = require("../models/OTP");
const profile = require("../models/profile");


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

                    while (result) {
                        otp = otpGenerator.generate(6, {
                        upperCaseAlphabets: false,
                        lowerCaseAlphabets: false,
                        specialChars: false,
                    });
                    
                    result = await OTP.findOne({ otp: otp });
                }


        // Step 4: At this point, otp is guaranteed unique
        console.log("Unique OTP:", otp);

        
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

    })}
};



// sign up model

exports.signUp = async (req,res) => {

    //fetch data

    try{

        const {

            firstName,
            lastName,
            email,
            contactnumber,
            password,
            confirmpassword,
            acctype,
            otp

        } = req.body


        //check required fields


        if(!firstName || !lastName || !email || !contactnumber || !password || !confirmpassword || !acctype || !otp) {

            return res.status(403).json({
                success : false,
                message : "All fields are required",
            })
        }

        // validate passwords

        if(password !== confirmpassword) {
            return res.status(403).json({
                success : false,
                message : "Password and confirmpassword does not match",
            })
        }

        // check user existence

        const check_user = await user.findOne({email}); // user is the model jo ki db se baat krr rha hai so we are querying the db to check 

        if(check_user) {
            res.status(400).json({
                success : false,
                message : "User already exists."
            })
        };

        // find most recent OTP

        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

        if (recentOtp.length === 0 ) {
            res.status(400).json({
                success : false,
                message : "OTP NOT FOUND."

        })

    }else if (otp !== recentOtp[0].otp) {
        res.status(400).json({
            success : false,
            message : "OTP does not match."
        })};

        // hashing password

        const hashed_password = await bcrypt.hash(password,10);

        //create entry of user in DB

        const profileDetails = await profile.create({
            gender: null,
            dateofbirth : null,
            contactnumber : null,
            about : null,
        })

        const user_entry = await user.create({

            firstName,
            lastName,
            email,
            contactnumber,
            password: hashed_password,
            acctype,
            otp,
            additionaldetails : profileDetails._id,
            image : 'https://api.dicebear.com/9.x/initials/svg?seed=${firstName}%20${lastName}'

        });

        return res.status(200).json({
            success : true,
            message : "User registered successfully"
        });

    }

    catch(err){
        console.error(err);
        res.status(500).json({
                success : false,
                message : "User cannot be registered..",

    })}
}







