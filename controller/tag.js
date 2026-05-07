const tag = require("../models/tag");

exports.createTag = async (req,res) => {
    try{

        //fetch details

        const {name, description} = req.body;

        if(!name || !description) {
            return res.status(400).json({
                success : false,
                message : "Name and description needed."
            })
        };

        // Tag creation in DB

        const tagDetails = await tag.create({
            tagName : name,
            tagDescription : description,

        });
        console.log(tagDetails);
        return res.status(200).json({
            success : true,
            message : "Tag created succesfully.. "
        })


    }

    catch(err){
        return res.status(403).json({
            success: false,
            message: err.message,
        })

    }
}


//all tag finder api 

exports.tagFinder = async (req,res) => {

    try{

        const tag_find = await tag.find({},{tagName : true , tagDescription : true});
        console.log(tag_find);

        return res.status(200).json({
            success : true,
            message : "All tags are listed here "
        })

    }

    catch{

    }
}