const Course = require("../models/Course")
const user = require("../models/user");
const ratingAndReviews = require("../models/RatingandReviews");

exports.RatingReviewHandler = async (req,res) => {

    try{

        //get userid and courseid
        //check if user is enrolled 
        //create if user already reviewed the course 
        //create review and Rating
        //update course with its rating/review


        const userID = req.currentUser.id
        const {courseID,rating,review} = req.body

        if (!userID || !courseID) {
            return res.status(403).json({
                success : false,
                message : "Everything not fetched"
            })
        }

        // want to check if user is enrolled in that particular course.

        const check = await Course.findOne({_id : courseID , studentsEnrolled : userID})  //you can use studentsEnrolled: {$elemMatch: {$eq: userId} this as well
        const checkalreadyreview = await ratingAndReviews.findOne({
            user : userID,
            course : courseID,
        })

        if (checkalreadyreview){

            return res.status(403).json({
                success: false,
                message : "User has already rated and reviewed the course."
            })

        }

        const updation = await ratingAndReviews.create({
            user : userID,
            review,
            rating,
            course : courseID,

        })

        // update the course 

        await Course.findByIdAndUpdate(courseID , {$push : {ratingAndReviews : updation._id}}, {new:true})

        return res.status(200).json({
            success : true,
            message : "Rating and review created succesffully.",
            data : updation,
        })
    }

    catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Rating and review error",
    });
  }
}




//getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
            //get course ID
            const courseId = req.body.courseId;
            //calculate avg rating

            const result = await ratingAndReviews.aggregate([
                {
                    $match:{
                        course: new mongoose.Types.ObjectId(courseId),
                    },
                },
                {
                    $group:{
                        _id:null,
                        averageRating: { $avg: "$rating"},
                    }
                }
            ])

            //return rating
            if(result.length > 0) {

                return res.status(200).json({
                    success:true,
                    averageRating: result[0].averageRating,
                })

            }
            
            //if no rating/Review exist
            return res.status(200).json({
                success:true,
                message:'Average Rating is 0, no ratings given till now',
                averageRating:0,
            })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//getAllRatingAndReviews

exports.getAllRating = async (req, res) => {
    try{
            const allReviews = await ratingAndReviews.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select: "courseName",
                                    })
                                    .exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}