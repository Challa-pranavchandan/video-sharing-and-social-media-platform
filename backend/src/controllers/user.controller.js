import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiRespone.js";

const generateAccessandRefreshToken = (userId) =>async() => {

   try{
      // Generate access token and refresh token using JWT or any other method you prefer
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
    
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
   }catch(error){
      throw new ApiError(500, "Failed to generate tokens");
   }
   // Here you can add code to generate access token and refresh token using JWT or any other method you prefer
   // You can use the user data to create the payload for the tokens
   // Return the generated tokens

}


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
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }
    const user = await User.findOne({ $or: [{ email }, { username: email }] });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
      const isPasswordMatch = await user.isPasswordCorrect(password);
    if (!isPasswordMatch) {
        throw new ApiError(401, "Invalid credentials");
    }
    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);
     
    const loggedUser = await User.findById(user._id).
    select("-password -refreshToken");
    
    const options = {
         httpOnly: true,
         secure:true
    }
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { refreshToken,accessToken, user: loggedUser },
      "User logged in successfully"
    ));
   
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(req.user._id, 
   {
       $set: { refreshToken: undefined }
    },
    {
       new: true
    }
 )
const options = {
         httpOnly: true,
         secure:true
    }
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "User logged out successfully"));
})


export { registerUser, loginUser , logoutUser };




