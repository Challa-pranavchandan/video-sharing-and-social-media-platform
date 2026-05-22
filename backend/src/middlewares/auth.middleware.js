import asyncHandler from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken.userId).select("-password -refreshToken");

    if (!user) {

      throw new ApiError(401, "Unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }

})


export { verifyJWT }