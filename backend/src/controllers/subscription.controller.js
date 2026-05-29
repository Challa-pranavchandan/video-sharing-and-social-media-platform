import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Subscription } from "../models/subscription.model.js";
import ApiResponse from "../utils/ApiRespone.js";
import mongoose from "mongoose";

// POST /api/v1/subscriptions/c/:channelId
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    if (channelId.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId,
    });

    if (existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id);
        return res
            .status(200)
            .json(new ApiResponse(200, { isSubscribed: false }, "Unsubscribed successfully"));
    }

    await Subscription.create({
        subscriber: req.user._id,
        channel: channelId,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { isSubscribed: true }, "Subscribed successfully"));
});

// GET /api/v1/subscriptions/c/:channelId/subscribers
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: { channel: new mongoose.Types.ObjectId(channelId) },
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                subscriber: { $first: "$subscriber" },
            },
        },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"));
});

// GET /api/v1/subscriptions/u/:subscriberId/channels
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    const channels = await Subscription.aggregate([
        {
            $match: { subscriber: new mongoose.Types.ObjectId(subscriberId) },
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                channel: { $first: "$channel" },
            },
        },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, channels, "Subscribed channels fetched successfully"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
