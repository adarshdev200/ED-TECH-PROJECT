const cloudinary = require('cloudinary').v2

exports.uploadImageToCloudinary = async (file,folder,height,quaility) => {

    const {options} = folder;
    if (height) {
        options.height = height;
    };

    if(quaility) {
        options.quaility = quaility;
    };

    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath , options);


}