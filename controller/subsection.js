const section = require("../models/section");
const subsection = require("../models/subsection");
const { uploadImageToCloudinary } = require("../utils/cloudinary");


exports.createSubsection = async (req,res) => {

    try{

        const{title,description,timeDuration,sectionID} = req.body;

        const videofile = req.file.videofile;

        if(!title || !description || !timeDuration || !sectionID) {
            return res.status(403).json({
                success : false,
                message : "All fields are required. "
            })
        };

        const uploadDetails = await uploadImageToCloudinary(videofile,process.env.FOLDER_NAME);

        const subsec = await subsection.create({
            title,
            description,
            timeDuration,
            videoURL : uploadDetails.secure_url ,
        })

        const updatedSection = await section.findByIdAndUpdate({ _id :sectionID}, {$push : {Subsection : subsec._id }} , {new:true});

        return res.status(200).json({
            success : true,
            message : "Sub-Section created succesfully",
            updatedSection,
        })
    }

    catch(err) {
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })

    }
}



//Pending delete and update sub section and all
