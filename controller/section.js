const Course = require("../models/Course");
const section = require("../models/section");


// Code to create a section..

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseID } = req.body;

    if (!sectionName || !courseID) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const addSectionName = await section.create({ sectionName });

    const updatedCourse = await Course.findByIdAndUpdate(
        courseID ,
      { $push: { coursecontent: addSectionName._id } },
      { new: true },
    )
      .populate("coursecontent")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      data: updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create section",
      error: error.message,
    });
  }
};


// Code to Delete a section..


exports.deleteSection = async (req, res) => {
  try {
    const { sectionID, courseID } = req.body;


    const updateDeletedCourse = await Course.findByIdAndUpdate(
        courseID,
        {$pull : {coursecontent : sectionID}},
        {new:true},
    )

    await section.findByIdAndDelete(sectionID);

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: updateDeletedCourse});

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create section",
      error: error.message,
    });
  }
};



// Code to UPDATE a section..

exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionID } = req.body;

    if (!sectionName || !sectionID) {
      return res.status(400).json({
        success: false, 
        message: "All fields are required",
      });
    }


    const updateSection = await section.findByIdAndUpdate(
        sectionID,
        {sectionName},
        {new:true},
    )

    return res.status(200).json({
      success: true,
      message: "successfully updated the section"});

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update section",
      error: error.message,
    });
  }
};
