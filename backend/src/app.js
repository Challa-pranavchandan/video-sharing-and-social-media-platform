import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import { marked } from "marked";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Root route - Serve API Testing Guide
app.get("/", (req, res) => {
    try {
        const filePath = path.join(__dirname, "../../API_TESTING_GUIDE.md");
        const markdown = fs.readFileSync(filePath, "utf-8");
        const html = marked(markdown);
        
        const htmlPage = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>API Testing Guide - Video Sharing Platform</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        padding: 20px;
                    }
                    .container {
                        max-width: 900px;
                        margin: 0 auto;
                        background: white;
                        padding: 40px;
                        border-radius: 10px;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    }
                    h1, h2, h3, h4, h5, h6 { margin: 20px 0 10px; color: #667eea; }
                    h1 { font-size: 2.5em; border-bottom: 3px solid #667eea; padding-bottom: 10px; }
                    h2 { font-size: 1.8em; margin-top: 30px; }
                    h3 { font-size: 1.3em; }
                    p { margin: 10px 0; }
                    ul, ol { margin: 10px 0 10px 20px; }
                    li { margin: 5px 0; }
                    code {
                        background: #f5f5f5;
                        padding: 2px 6px;
                        border-radius: 3px;
                        font-family: 'Courier New', monospace;
                        color: #d63384;
                    }
                    pre {
                        background: #282c34;
                        color: #abb2bf;
                        padding: 15px;
                        border-radius: 5px;
                        overflow-x: auto;
                        margin: 10px 0;
                        font-family: 'Courier New', monospace;
                    }
                    a { color: #667eea; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                    blockquote {
                        border-left: 4px solid #667eea;
                        padding-left: 15px;
                        margin: 15px 0;
                        color: #666;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        margin: 15px 0;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 12px;
                        text-align: left;
                    }
                    th { background: #667eea; color: white; }
                    tr:nth-child(even) { background: #f9f9f9; }
                </style>
            </head>
            <body>
                <div class="container">
                    ${html}
                </div>
            </body>
            </html>
        `;
        
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.send(htmlPage);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Failed to load API Testing Guide",
            error: error.message 
        });
    }
});

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
