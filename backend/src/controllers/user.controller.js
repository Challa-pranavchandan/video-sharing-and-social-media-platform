import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiRespone.js";

const generateAccessandRefreshToken = async (userId) => {

   try {
      // Generate access token and refresh token using JWT or any other method you prefer
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
   } catch (error) {
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
   const { email, username, password } = req.body;

   if (!password) {
      throw new ApiError(400, "Password is required");
   }
   if (!email && !username) {
      throw new ApiError(400, "Email or username is required");
   }
   const user = await User.findOne({ $or: [{ email: email || username }, { username: username || email }] });
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
      secure: true
   }
   return res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { refreshToken, accessToken, user: loggedUser },
         "User logged in successfully"
      ));

});

const logoutUser = asyncHandler(async (req, res) => {
   await User.findByIdAndUpdate(req.user._id,
      {
         $set: { refreshToken: undefined }
      },
      {
         new: true
      }
   )
   const options = {
      httpOnly: true,
      secure: true
   }
   return res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, null, "User logged out successfully"));
})

const refreshAccesesToken = asyncHandler(async (req, res) => {
   const IncomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken;

   if (!IncomingrefreshToken) {
      throw new ApiError(401, "Refresh token is missing");
   }
   try {
      const decodedToken = await jwt.verify(
         IncomingrefreshToken, 
         process.env.REFRESH_TOKEN_SECRET 
      );
      const user = await User.findById(decodedToken?._id);
      if(!user){
         throw new ApiError(401,"Invalid refresh token");
      }
      if(IncomingrefreshToken !== user?.refreshToken){
         throw new ApiError(401,"Refresh token has expired");
      }
   
      const options = {
         httpOnly: true,
         secure: true
      }
      const {accessToken, newrefreshToken} = await generateAccessandRefreshToken(user._id).then(({ accessToken, refreshToken }) => {
         user.refreshToken = refreshToken;
         user.save({ validateBeforeSave: false });
         return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(new ApiResponse(200,
            { accessToken, refreshToken: newrefreshToken }, 
            "Access token refreshed successfully"));
      })
   
   } catch (error) {
      throw new ApiError(401, "Invalid refresh token");
   }

});

const changeCurrentUserPassword = asyncHandler(async (req, res) => {
   const { currentPassword, newPassword  } = req.body;

   if (!currentPassword || !newPassword) {
      throw new ApiError(400, "Current password and new password are required");
   }
   const user = await User.findById(req.user?._id);
   const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
   if (!isPasswordCorrect) {
      throw new ApiError(400, "Current password is incorrect");
   }
   user.password = newPassword;
   await user.save({ validateBeforeSave: false });
   return res.status(200).json(
      new ApiResponse(200, null,
          "Password updated successfully"
         ));
});
const getCurrentUser = asyncHandler(async(req,res)=>
{
   return res
   .status(200)
   .json(200,req.user,"current user fetched successfully")

})
const updateAccountDetails = asyncHandler(async(req,res)=>
{
   const {fullName,email}=req.body

   if (!fullName || !email){
      throw new ApiError(400,"all feilds required")
   }


   User.findByIdAndUpdate(
      req.user?._id,
      {
         $set:{
            fullName,
            email:email

         }
      },
      {new: true} 
   ).select("-password")


   return res
   .status(200)
   .json(new ApiResponse(
      200,
      user,
      "Account detailsupdated successfully"))

})

const updateuserAvatar = asyncHandler(async(req,res)
=>{
   const avatarLocalPath = req.file?.path;
   if(!avatarLocalPath){
      throw new ApiError(400, "Avatar file is required");
   }
   const avatar = await uploadOnCloudinary(avatarLocalPath, "avatars");
   if(!avatar.url){
      throw new ApiError(500, "error while uploading avatar");
   }
   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set:{
            avatar:avatar.url
         }
      },
      {new: true} 
   ).select("-password")
    return res
   .status(200)
   .json(new ApiResponse(
      200,
      user,
      "Avatar changed successfully"))

})
const updateuserCoverImage = asyncHandler(async(req,res)
=>{
   const coverImageLocalPath = req.file?.path;
   if(!coverImageLocalPath){
      throw new ApiError(400, "Cover image file is required");
   }
   const coverImage = await uploadOnCloudinary(coverImageLocalPath, "cover-images");
   if(!coverImage.url){
      throw new ApiError(500, "error while uploading cover image");
   }
   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set:{
            coverImage:coverImage.url
         }
      },
      {new: true} 
   ).select("-password")
    return res
   .status(200)
   .json(new ApiResponse(
      200,
      user,
      "cover image changed successfully"))

})


export { 
   registerUser, 
   loginUser, 
   logoutUser, 
   refreshAccesesToken, 
   changeCurrentUserPassword, 
   getCurrentUser, 
   updateAccountDetails, 
   updateuserAvatar,
   updateuserCoverImage
 };



