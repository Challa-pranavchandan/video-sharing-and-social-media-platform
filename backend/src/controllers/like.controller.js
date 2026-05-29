import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../models/Like.model.js";
import ApiResponse from "../utils/ApiRespone.js";
import mongoose from "mongoose";

// Toggle like on a video
// POST /api/likes/toggle/v/:videoId
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Video unliked successfully"));
    }

    await Like.create({
        video: videoId,
        likedBy: req.user._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Video liked successfully"));
});

// Toggle like on a comment
// POST /api/likes/toggle/c/:commentId
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Comment unliked successfully"));
    }

    await Like.create({
        comment: commentId,
        likedBy: req.user._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Comment liked successfully"));
});

// Toggle like on a tweet
// POST /api/likes/toggle/t/:tweetId
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Tweet unliked successfully"));
    }

    await Like.create({
        tweet: tweetId,
        likedBy: req.user._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Tweet liked successfully"));
});

// GET /api/likes/videos  — get all videos liked by logged in user
const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id),
                video: { $ne: null },
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
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
                            owner: { $first: "$owner" },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                video: { $first: "$video" },
            },
        },
        {
            $match: {
                "video.isPublished": true,
            },
        },
        {
            $sort: { createdAt: -1 },
        },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
