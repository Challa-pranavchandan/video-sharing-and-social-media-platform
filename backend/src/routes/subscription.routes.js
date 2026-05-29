import { Router } from "express";
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // All subscription routes require auth

// Toggle subscribe/unsubscribe to a channel
router.route("/c/:channelId").post(toggleSubscription);

// Get all subscribers of a channel
router.route("/c/:channelId/subscribers").get(getUserChannelSubscribers);

// Get all channels a user has subscribed to
router.route("/u/:subscriberId/channels").get(getSubscribedChannels);

export default router;
