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


exports.deleteSubsection = async (req,res) => {

    try{

        const{sectionID,subSectionID} = req.body;

        if(!sectionID || !subSectionID) {
            return res.status(403).json({
                success : false,
                message : "dikat hai bhaiya "

            })
        };

        const deletefromsubsection = await subsection.findByIdAndDelete({_id : subSectionID})

        const updatedsubsec = await section.findByIdAndUpdate({_id :sectionID},{$pull : {Subsection : subSectionID._id }},{new:true});

        return res.status(200).json({
            success: true,
            message: "Subsection deleted successfully",
            updatedsubsec,

        });
    }
    catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
}}  
