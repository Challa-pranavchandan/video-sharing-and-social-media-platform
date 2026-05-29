import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadonCloudinary = async (filePath, folder = "") => {
    try {
        if (!filePath) return null;

        const retries = 3;
        let result = null;
        let attempt = 0;

        while (attempt < retries) {
            try {
                result = await cloudinary.uploader.upload(filePath, {
                    resource_type: "auto",
                    folder: folder
                });
                if (result) break; // Success
            } catch (err) {
                attempt++;
                console.log(`Cloudinary upload attempt ${attempt} failed for ${filePath}. Error: ${err.message}`);
                if (attempt >= retries) throw err;
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return result;
    } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        console.log("Error uploading image to Cloudinary after retries:", error);
        return null;
    }
};


export default uploadonCloudinary