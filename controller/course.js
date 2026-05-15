const Course = require("../models/Course");
const category = require("../models/Category");
const user = require("../models/user");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { populate } = require("dotenv");

exports.createCourse = async (req, res) => {
	try {
		// Get user ID from request object
		const userId = req.currentUser.id;

		// Get all required fields from request body
		let {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag,
			Category,
			status,
			instructions,
		} = req.body;

		// Get thumbnail image from request files
		const thumbnail = req.files.thumbnailImage;

		// Check if any of the required fields are missing
		if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag ||
			!thumbnail ||
			!Category
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}
		if (!status || status === undefined) {
			status = "Draft";
		}
		// Check if the user is an instructor
		const instructorDetails = await user.findById(userId, {
			accountType: "Instructor",
		});

		if (!instructorDetails) {
			return res.status(404).json({
				success: false,
				message: "Instructor Details Not Found",
			});
		}

		// Check if the tag given is valid
		const categoryDetails = await category.findById({_id : Category});
		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category Details Not Found",
			});
		}
		// Upload the Thumbnail to Cloudinary
		const thumbnailImage = await uploadImageToCloudinary(
			thumbnail,
			process.env.FOLDER_NAME
		);
		console.log(thumbnailImage);
		// Create a new course with the given details
		const newCourse = await Course.create({
			courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn: whatYouWillLearn,
			price,
			tag: tag,
			category: categoryDetails._id,
			thumbnail: thumbnailImage.secure_url,
			status: status,
			instructions: instructions,
		});

		// Add the new course to the User Schema of the Instructor
		await user.findByIdAndUpdate(
			{
				_id: instructorDetails._id,
			},
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		);
		// Add the new course to the Categories
		await category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCourse._id,
				},
			},
			{ new: true }
		);
		// Return the new course and a success message
		res.status(200).json({
			success: true,
			data: newCourse,
			message: "Course Created Successfully",
		});
	} catch (error) {
		// Handle any errors that occur during the creation of the course
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to create course",
			error: error.message,
		});
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

    catch(error) {

    return res.status(404).json({
        success: false,
        message : error.message,
      })


  }
}


exports.getCourseDetails = async (req,res) =>{
  try{

    const {courseID} = req.body;

    const findCourseByID = await Course.findById(courseID).populate({
      path : "instructor",
      populate : {
        path : "additionaldetails",
      }

    })
    .populate("ratingAndReviews")
    .populate({
      path : "coursecontent",
      populate :{
        path: "Subsection",
      }
    }).exec();


    if (!findCourseByID) {
      return res.status(403).json({
        success : false,
        message : "Could not fetch course details."
      })

    }

    return res.status(200).json({
      success : true,
      message : "Course details fetched",
      data : findCourseByID,
    })




  }
  catch(error) {

    return res.status(404).json({
        success: false,
        message : error.message,
      })


  }
}