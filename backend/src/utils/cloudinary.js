import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadonCloudinary = async (filePath) => {
    try {
        if (!filePath) return null
        const result = await cloudinary.uploader.upload(filePath, { 
            resource_type: "auto"
         }); // Upload the image to Cloudinary
        console.log("file uploaded ")
       
        return result.secure_url; // Return the URL of the uploaded image
    } catch (error) {
         fs.unlinkSync(filePath); // Remove the file from the server after uploading
        console.log("Error uploading image to Cloudinary:", error);
        return null;
    }
};


export default uploadonCloudinary