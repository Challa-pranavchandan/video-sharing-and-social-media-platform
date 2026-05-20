import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiRespone.js";




const registerUser = asyncHandler(async (req, res) => {
   /*
    1. get the user data from the request body(frontend will send the user data in the request body)
    2. validate the user data (e.g., check if the email is valid, password meets criteria, etc.)
    3. check if a user with the same email already exists in the database
    4.check wheather the avathar is provided or not if not then set the default avatar
    5. upload them to cloudinary and get the url of the uploaded image
    6. if not, hash the password and create a new user record in the database
    7. remove the password from the user data before sending the response 
    8. check if the user is created successfully, if not return an error response   
    7. return a success response with the created user data (excluding the password)
   */

   const { fullname, email, password, avatar, coverPhoto, username } = req.body;

   if (!fullname || !email || !password || !username) {
      throw new ApiError(400, "All fields are required");
   }

   const existingUser = await User.findOne({ $or: [{ email }, { username }] });
   if (existingUser) {
      throw new ApiError(409, "User with this email or username already exists");
   }


   const avatarPath = req.files?.avatar?.[0]?.path;
   const coverImagePath = req.files?.coverImage?.[0]?.path;

   if (!avatarPath) {
      throw new ApiError(400, "Avatar is required");
   }
   // Here you can add code to upload the avatar and cover photo to cloudinary and get the URLs

   const avatarUrl = await uploadonCloudinary(avatarPath, "avatars");
   const coverImageUrl = await uploadonCloudinary(coverImagePath, "coverPhotos");

   if (!avatarUrl) {
      throw new ApiError(500, "Failed to upload avatar");
   }
   // Here you can add code to create the user in the database with the avatarUrl and coverImageUrl
   const createdUser = await User.create({
      fullname,
      email,
      password,
      avatar: avatarUrl,
      coverImage: coverImageUrl || "",
      username: username.toLowerCase()
   });

   const createduser = await User.findById(createdUser._id).select("-password -refreshToken");

   if (!createduser) {
      throw new ApiError(500, "Failed to create user");
   }

   return res.status(201).json(new ApiResponse(201, createduser, "User registered successfully"));
});
 const loginUser = asyncHandler(async (req, res) => {
    // req.body -->data
    // find user by email
    // if user not found, throw error
    // if user found, compare password
    // if password not match, throw error
    // if password match, generate access token and refresh token
    // send cookie with refresh token and send access token in response
    res.status(200).json({
        message: "User logged in successfully"
    });
});


export { registerUser, loginUser };




