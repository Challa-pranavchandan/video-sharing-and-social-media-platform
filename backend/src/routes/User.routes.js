import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerUser ,logoutUser,loginUser} from "../controllers/User.controller.js";
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



export default router;