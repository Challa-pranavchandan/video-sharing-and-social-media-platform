import mongoose, { Schema } from "mongoose";

// A single like document references exactly ONE of: video, comment, or tweet
// The other two fields will be null/undefined

const likeSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
            default: null,
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet",
            default: null,
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Like = mongoose.model("Like", likeSchema);
