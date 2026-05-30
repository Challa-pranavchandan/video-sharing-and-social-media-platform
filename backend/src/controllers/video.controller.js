import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiRespone.js";
import mongoose from "mongoose";

// GET /api/videos?page=1&limit=10&query=&sortBy=createdAt&sortType=desc&userId=
const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query = "",
        sortBy = "createdAt",
        sortType = "desc",
        userId,
    } = req.query;

    const pipeline = [];

    // Filter by owner if userId provided
    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid userId");
        }
        pipeline.push({
            $match: { owner: new mongoose.Types.ObjectId(userId) },
        });
    }

    // Search by title or description
    if (query.trim()) {
        pipeline.push({
            $match: {
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } },
                ],
            },
        });
    }

    // Only published videos for non-owners
    pipeline.push({ $match: { isPublished: true } });

    // Lookup owner details
    pipeline.push({
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
    });

    pipeline.push({
        $addFields: {
            owner: { $first: "$owner" },
        },
    });

    // Sort
    pipeline.push({
        $sort: { [sortBy]: sortType === "asc" ? 1 : -1 },
    });

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    };

    const videos = await Video.aggregatePaginate(
        Video.aggregate(pipeline),
        options
    );

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

// POST /api/videos
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title?.trim() || !description?.trim()) {
        throw new ApiError(400, "Title and description are required");
    }

    const videoFilePath = req.files?.videoFile?.[0]?.path;
    const thumbnailPath = req.files?.thumbnail?.[0]?.path;

    if (!videoFilePath) {
        throw new ApiError(400, "Video file is required");
    }
    if (!thumbnailPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    const videoFile = await uploadonCloudinary(videoFilePath, "videos");
    const thumbnail = await uploadonCloudinary(thumbnailPath, "thumbnails");

    if (!videoFile?.url) {
        throw new ApiError(500, "Failed to upload video file");
    }
    if (!thumbnail?.url) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: videoFile.duration || 0,
        owner: req.user._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, video, "Video published successfully"));
});

// GET /api/videos/:videoId
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(videoId) },
        },
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
    ]);

    if (!video?.length) {
        throw new ApiError(404, "Video not found");
    }

    // Increment views
    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

    // Add to watch history
    await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { watchHistory: videoId },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, video[0], "Video fetched successfully"));
});

// PATCH /api/videos/:videoId
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this video");
    }

    const thumbnailPath = req.file?.path;
    let thumbnailUrl = video.thumbnail;

    if (thumbnailPath) {
        const thumbnail = await uploadonCloudinary(thumbnailPath, "thumbnails");
        if (!thumbnail?.url) {
            throw new ApiError(500, "Failed to upload thumbnail");
        }
        thumbnailUrl = thumbnail.url;
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: title || video.title,
                description: description || video.description,
                thumbnail: thumbnailUrl,
            },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

// DELETE /api/videos/:videoId
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this video");
    }

    await Video.findByIdAndDelete(videoId);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Video deleted successfully"));
});

// PATCH /api/videos/toggle/publish/:videoId
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this video");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: { isPublished: !video.isPublished } },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedVideo,
                `Video ${updatedVideo.isPublished ? "published" : "unpublished"} successfully`
            )
        );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
