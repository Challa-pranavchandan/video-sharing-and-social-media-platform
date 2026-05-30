import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { 
   registerUser, 
   loginUser, 
   logoutUser, 
   refreshAccesesToken, 
   changeCurrentUserPassword, 
   getCurrentUser, 
   updateAccountDetails, 
   updateuserAvatar,
   updateuserCoverImage,
   getUserChannelProfile,
   getWatchHistory
} from "../controllers/user.controller.js";
import {verifyJWT}  from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([
    {
        name: "avatar", //here we used multer to upload photos and we are expecting two fields one is avatar and 
        // another is coverPhoto and both of them will accept only one file
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), registerUser);

router.route("/login").post(loginUser);



//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post( refreshAccesesToken);
router.route("/change-password").post(verifyJWT, changeCurrentUserPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),
 updateuserAvatar);
router.route("/update-cover").patch(verifyJWT,upload.single("coverImage"),
 updateuserCoverImage);
router.route("/channel/:username").get(getUserChannelProfile);
router.route("/watch-history").get(verifyJWT, getWatchHistory);



export default router;