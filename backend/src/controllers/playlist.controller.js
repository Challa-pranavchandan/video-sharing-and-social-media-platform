import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.model.js";
import ApiResponse from "../utils/ApiRespone.js";
import mongoose from "mongoose";

// POST /api/playlists
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name?.trim()) {
        throw new ApiError(400, "Playlist name is required");
    }

    const playlist = await Playlist.create({
        name,
        description: description || "",
        owner: req.user._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

// GET /api/playlists/user/:userId
const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const playlists = await Playlist.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(userId) },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $match: { isPublished: true },
                    },
                    {
                        $project: {
                            title: 1,
                            thumbnail: 1,
                            duration: 1,
                            views: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                totalVideos: { $size: "$videos" },
            },
        },
        {
            $sort: { createdAt: -1 },
        },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "User playlists fetched successfully"));
});

// GET /api/playlists/:playlistId
const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(playlistId) },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $match: { isPublished: true },
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
                ],
            },
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
                totalVideos: { $size: "$videos" },
            },
        },
    ]);

    if (!playlist?.length) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist[0], "Playlist fetched successfully"));
});

// PATCH /api/playlists/:playlistId
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    if (!name?.trim()) {
        throw new ApiError(400, "Playlist name is required");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description: description || playlist.description,
            },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"));
});

// DELETE /api/playlists/:playlistId
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this playlist");
    }

    await Playlist.findByIdAndDelete(playlistId);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Playlist deleted successfully"));
});

// PATCH /api/playlists/add/:videoId/:playlistId
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $addToSet: { videos: videoId } },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully"));
});

// PATCH /api/playlists/remove/:videoId/:playlistId
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: new mongoose.Types.ObjectId(videoId) } },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully"));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
};
