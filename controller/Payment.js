const { instance } = require("../config/razorpay");
const user = require("../models/user");
const course = require("../models/Course");
const mailSender = require("../utils/nodemailer");


exports.capturePayment = async (req, res) => {
  try {
    //fetch user-id and courseid details

    const userid = req.currentUser.id;
    const { course_id } = req.body;

    // validate details

    if (!userid || !course_id) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const courseExist = await course.findById(course_id);

    if (!courseExist) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //user already pay for the same course
    const uid = new mongoose.Types.ObjectId(userid);
    if (courseExist.studentsEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Student is already enrolled",
      });
    }
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Site broken , Bad gateway",
    });
  }
};

        //order create
    const amount = courseExist.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userid,
        }
    };

    try{
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        //return response
        return res.status(200).json({
            success:true,
            courseName:courseExist.courseName,
            courseDescription:courseExist.courseDescription,
            thumbnail: courseExist.thumbnail,
            orderId: paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
        });
    }
    catch(error) {
        console.log(error);
        res.json({
            success:false,
            message:"Could not initiate order",
        });
    }



exports.verifySignature = async (req, res) => {
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];

    const shasum =  crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest) {
        console.log("Payment is Authorised");

        const {courseId, userid} = req.body.payload.payment.entity.notes;

        try{
                //fulfil the action

                //find the course and enroll the student in it
                const enrolledCourse = await course.findOneAndUpdate(
                                                {_id: courseId},
                                                {$push:{studentsEnrolled: userid}},
                                                {new:true},
                );

                if(!enrolledCourse) {
                    return res.status(500).json({
                        success:false,
                        message:'Course not Found',
                    });
                }

                console.log(enrolledCourse);

                //find the student andadd the course to their list enrolled courses me 
                const enrolledStudent = await user.findOneAndUpdate(
                                                {_id:userid},
                                                {$push:{courses:courseId}},
                                                {new:true},
                );

                console.log(enrolledStudent);

                //mail send krdo confirmation wala 
                const emailResponse = await mailSender(
                                        enrolledStudent.email,
                                        "Congratulations from CodeHelp",
                                        "Congratulations, you are onboarded into new CodeHelp Course",
                );

                console.log(emailResponse);
                return res.status(200).json({
                    success:true,
                    message:"Signature Verified and COurse Added",
                });


        }       
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }
    else {
        return res.status(400).json({
            success:false,
            message:'Invalid request',
        });
    }


};



