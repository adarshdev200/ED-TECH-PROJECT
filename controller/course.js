const Course = require("../models/Course");
const tag = require("../models/Category");
const user = require("../models/user");
const { uploadImageToCloudinary } = require("../utils/cloudinary");

exports.createCourse = async (req, res) => {
  try {
    // fetch details..
    const { courseName, courseDescription, whatwillyoulearn, price, Tags } =
      req.body;

    // get thumbnail
    const thumbNail = req.file.thumbNail;

    //validation

    if (
      !courseName ||
      !courseDescription ||
      !whatwillyoulearn ||
      !price ||
      !Tags
    ) {
      return res.status(400).json({
        success: false,
        message: "Give all field names.",
      });
    }

    //check for instructor

    const instructorId = req.currentUser.id;
    const instructorDetails = await user.findById(instructorId);
    console.log(instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details not found",
      });
    }

    // check for valid tags if there..

    const tagDetails = await tag.findById(Tags);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    // upload thumbnail to cloudinary 

    const thumbNailImage = await uploadImageToCloudinary(thumbNail,process.env.FOLDER_NAME);

    // create entry for new course

    const newCourse = await Course.create({

        courseName : courseName,
        courseDescription : courseDescription,
        whatwillyoulearn : whatwillyoulearn,
        price : price,
        instructor : instructorDetails._id,
        Tags : Tags,
        thumbNail : thumbNailImage.secure_url,

    })

    // add new course in array..

    await user.findByIdAndUpdate({_id : instructorDetails._id }, {$push : {courses : newCourse._id}},{new:true});

    return res.status(200).json({
        success: true,
        message : "Course created successfully.",
      })


  } 
  
  catch(error) {

    return res.status(404).json({
        success: false,
        message : error.message,
      })


  }
};


//get all courses (all means all not specifically of this instructor)

exports.getAllCourses = async (req,res) => {

    try{
        const fetchAllCourses = await Course.find({},{
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true,
        }).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            data: fetchAllCourses,
    });

    }

    catch{

    }
}


