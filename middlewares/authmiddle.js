const user = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config() 

//Authentication

exports.auth = async (req,res,next) => {
    try{

        const token = req.body?.token || req.cookies?.token|| req.header("Authorization")?.replace("Bearer ", "");  //|| req.cookies.token 

        console.log(req.headers);
        console.log(token);



        if(!token) {
            return res.status(403).json({
                success : false,
                message : "JSON TOKEN NOT FOUND",

            }) ;
        }

        //token verification

        try {

            const payload = jwt.verify(token , process.env.JWT_SECRET);
            console.log(payload);
            req.currentUser = payload

        }
        catch(err){

            return res.status(401).json({
                success : false,
                message : "token is invalid",
            })

        }
        next();


    }

    catch(error){
        console.log(error);
        return res.status(401).json({
                success : false,
                message : "Error while authenticating the token.",


    })
}}


exports.isStudent = (req,res,next) => {
    try{
            if(req.currentUser.role !== "Student") {
                return res.status(401).json({
                    success:false,
                    message:'THis is a protected route for students',
                });
            }
            next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User Role is not matching',
        })
    }
}

exports.isInstructor = (req,res,next) => {
    try{
        if(req.currentUser.role !== "Instructor") {
            return res.status(401).json({
                success:false,
                message:'THis is a protected route for Instructor',
            });
        }
        next();
}
catch(error) {
    return res.status(500).json({
        success:false,
        message:'User Role is not matching',
    })
}
}


exports.isAdmin = (req,res,next) => {
    try{
        if(req.currentUser.role !== "Admin") {
            return res.status(401).json({
                success:false,
                message:'THis is a protected route for Admin',
            });
        }
        next();
}
catch(error) {
    return res.status(500).json({
        success:false,
        message:'User Role is not matching',
    })
}
}