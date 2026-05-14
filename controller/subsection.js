const section = require("../models/section");
const subsection = require("../models/subsection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubsection = async (req, res) => {
  try {
    const { title, description, timeDuration, sectionID } = req.body;

    const videofile = req.file.videofile;

    if (!title || !description || !timeDuration || !sectionID) {
      return res.status(403).json({
        success: false,
        message: "All fields are required. ",
      });
    }

    const uploadDetails = await uploadImageToCloudinary(
      videofile,
      process.env.FOLDER_NAME,
    );

    const subsec = await subsection.create({
      title,
      description,
      timeDuration,
      videoURL: uploadDetails.secure_url,
    });

    const updatedSection = await section.findByIdAndUpdate(
      { _id: sectionID },
      { $push: { Subsection: subsec._id } },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Sub-Section created succesfully",
      updatedSection,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Pending delete and update sub section and all

exports.deleteSubsection = async (req, res) => {
  try {
    const { sectionID, subSectionID } = req.body;

    if (!sectionID || !subSectionID) {
      return res.status(403).json({
        success: false,
        message: "dikat hai bhaiya ",
      });
    }

    const deletefromsubsection = await subsection.findByIdAndDelete({
      _id: subSectionID,
    });

    const updatedsubsec = await section.findByIdAndUpdate(
      { _id: sectionID },
      { $pull: { Subsection: subSectionID._id } },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Subsection deleted successfully",
      updatedsubsec,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateSubsection = async (req, res) => {
  try {
    const { sectionId, title, description } = req.body;
    const subSection = await subsection.findById(sectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME,
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    return res.json({
      success: true,
      message: "Section updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    });
  }
};
