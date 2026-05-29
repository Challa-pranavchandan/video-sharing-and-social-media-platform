import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: process.env.cors_origin,
        credentials: true,
    })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import userRoutes from "./routes/User.routes.js";
import videoRoutes from "./routes/video.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import likeRoutes from "./routes/like.routes.js";
import tweetRoutes from "./routes/tweet.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import healthcheckRoutes from "./routes/healthcheck.routes.js";

// Routes declaration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/playlists", playlistRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/healthcheck", healthcheckRoutes);

export default app;
