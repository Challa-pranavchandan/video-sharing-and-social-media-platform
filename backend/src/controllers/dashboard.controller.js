import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/Video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/Like.model.js";
import ApiResponse from "../utils/ApiRespone.js";
import mongoose from "mongoose";

// GET /api/dashboard/stats
// Returns total videos, total views, total subscribers, total likes for the logged in channel owner
const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user._id;

    // Total subscribers
    const totalSubscribers = await Subscription.countDocuments({
        channel: channelId,
    });

    // Total videos + total views (aggregate)
    const videoStats = await Video.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(channelId) },
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" },
            },
        },
    ]);

    // Total likes on all videos owned by this channel
    const videoIds = await Video.find({ owner: channelId }).select("_id");

    const totalLikes = await Like.countDocuments({
        video: { $in: videoIds.map((v) => v._id) },
    });

    const stats = {
        totalSubscribers,
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        totalLikes,
    };

    return res
        .status(200)
        .json(new ApiResponse(200, stats, "Channel stats fetched successfully"));
});

// GET /api/dashboard/videos
// Returns all videos uploaded by the logged in channel owner
const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.user._id;

    const videos = await Video.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(channelId) },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes",
            },
        },
        {
            $addFields: {
                totalLikes: { $size: "$likes" },
            },
        },
        {
            $project: {
                likes: 0,
            },
        },
        {
            $sort: { createdAt: -1 },
        },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
