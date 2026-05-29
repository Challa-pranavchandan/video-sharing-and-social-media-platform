import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Comment } from "../models/Comment.model.js";
import { Video } from "../models/Video.model.js";
import ApiResponse from "../utils/ApiRespone.js";
import mongoose from "mongoose";

// GET /api/comments/:videoId?page=1&limit=10
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const pipeline = [
        {
            $match: { video: new mongoose.Types.ObjectId(videoId) },
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
        {
            $sort: { createdAt: -1 },
        },
    ];

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    };

    const comments = await Comment.aggregatePaginate(
        Comment.aggregate(pipeline),
        options
    );

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

// POST /api/comments/:videoId
const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"));
});

// PATCH /api/comments/c/:commentId
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this comment");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $set: { content } },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

// DELETE /api/comments/c/:commentId
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this comment");
    }

    await Comment.findByIdAndDelete(commentId);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
