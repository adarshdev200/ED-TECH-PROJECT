const profile = require("../models/profile");
const user = require("../models/user");


exports.updateProfile = async (req,res) => {

    try{

        //fetch data
        const {dateofbirth="",about="",contactnumber,gender} = req.body;

        //user id fetch
        const userid = req.currentUser.id;

        //validation

        if(!userid || !contactnumber || !gender) {
            return res.status(403).json({
                success : false,
                message : "All details required."
            })

        }

        // user db mai call through userid , userid se we will fetch additional details aka profile uski id aayegi bcoz it is of type object id

        const getuser = await user.findById(userid);
        const getDetailsId = getuser.additionaldetails;
        const profiledetails = await profile.findById(getDetailsId);

        // update profile

        profiledetails.dateofbirth = dateofbirth;
        profiledetails.gender = gender;
        profiledetails.contactnumber = contactnumber;
        profiledetails.about = about;

        await profiledetails.save();


        return res.status(200).json({
            success : true,
            message : "Profile updated successfully man",
            profiledetails,
        })
    }

    catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update section",
      error: error.message,
    });
  }
}


// Delete profile handler 

exports.deleteProfile = async (req,res) => {

    try{

        const userid = req.currentUser.id;

        const getuser = await user.findById(userid);
        const getDetailsId = getuser.additionaldetails;
        await profile.findByIdAndDelete({_id : getDetailsId});
        await user.findByIdAndDelete({_id : userid})
       
        return res.status(200).json({
            success : true,
            message : "Profile deleted.",
        })
    }
    catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update section",
      error: error.message,
    });
  }
}
