# 🎬 Video Sharing & Social Media Platform — API Testing Guide

> A production-style REST API built with **Node.js · Express · MongoDB · Cloudinary**.  
> Clone the repo, run the server, import one Postman file — and every endpoint is ready to test.

---

## 📑 Table of Contents

1. [Tech Stack](#-tech-stack)
2. [Prerequisites](#-prerequisites)
3. [Local Setup](#-local-setup)
4. [Environment Variables](#-environment-variables)
5. [Import the Postman Collection](#-import-the-postman-collection)
6. [Recommended Test Sequence](#-recommended-test-sequence)
7. [API Reference](#-api-reference)
   - [Health Check](#1-health-check)
   - [Users](#2-users)
   - [Videos](#3-videos)
   - [Comments](#4-comments)
   - [Likes](#5-likes)
   - [Tweets](#6-tweets)
   - [Playlists](#7-playlists)
   - [Subscriptions](#8-subscriptions)
   - [Dashboard](#9-dashboard)
8. [Authentication](#-authentication)
9. [Response Format](#-response-format)
10. [Common Error Codes](#-common-error-codes)

---

## 🛠 Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Runtime     | Node.js (ESModules)                     |
| Framework   | Express.js                              |
| Database    | MongoDB + Mongoose                      |
| Auth        | JWT (Access Token + Refresh Token)      |
| File Upload | Multer → Cloudinary                     |
| Password    | bcrypt                                  |

---

## ✅ Prerequisites

- **Node.js** v18 or later
- **MongoDB** — local instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **Cloudinary** account — free tier works ([cloudinary.com](https://cloudinary.com))
- **Postman** — [download here](https://www.postman.com/downloads/)

---

## 🚀 Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/Challa-pranavchandan/video-sharing-and-social-media-platform.git
cd video-sharing-and-social-media-platform

# 2. Navigate to the backend
cd backend

# 3. Install dependencies
npm install

# 4. Create your environment file (see next section)
cp .env.sample .env   # then fill in your values

# 5. Start the development server
npm run dev
```

The server starts on **`http://localhost:8000`** by default.

---

## 🌐 Testing Environments

You can test the API in two ways:

### Local Testing
- **URL:** `http://localhost:8000`
- **Use Case:** Development & debugging
- **Prerequisites:** Backend must be running locally (`npm run dev`)

### Deployed Testing (Live Server)
- **URL:** `https://video-sharing-and-social-media-platform.onrender.com`
- **Use Case:** Testing production-ready code
- **No prerequisites:** Server is always running on Render

---

## 🔐 Environment Variables

Create a `.env` file inside the `/backend` directory with the following keys:

```env
PORT=8000

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# CORS
CORS_ORIGIN=http://localhost:5173

# JWT
ACCESS_TOKEN_SECRET=your_super_secret_access_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **Tip:** Get your Cloudinary credentials from the [Cloudinary Console](https://console.cloudinary.com/) → Dashboard.

---

## 📦 Import the Postman Collection

1. Open **Postman**
2. Click **Import** (top-left)
3. Select the file: `backend/VideoSocialPlatform.postman_collection.json`
4. The collection appears with **9 folders** and **34 pre-configured requests**

The collection uses **collection variables** — you only need to set `baseUrl` once.

**Choose your testing environment:**

1. **For Local Testing:**
   - Set `baseUrl` = `http://localhost:8000/api/v1`
   - Ensure backend is running: `npm run dev`

2. **For Deployed Testing (Live Server):**
   - Set `baseUrl` = `https://video-sharing-and-social-media-platform.onrender.com/api/v1`
   - No prerequisites needed

After a successful **Login**, `accessToken`, `refreshToken`, `userId`, `videoId`, etc. are saved **automatically** by the built-in test scripts.

---

## 🔄 Recommended Test Sequence

Run the requests in this order for a seamless end-to-end flow:

```
1.  GET  /healthcheck                        ← Confirm server is alive
2.  POST /users/register                     ← Create account (upload avatar)
3.  POST /users/login                        ← Get tokens (auto-saved)
4.  GET  /users/current-user                 ← Verify auth works
5.  GET  /users/channel/:username            ← View channel profile
6.  POST /videos                             ← Upload a video (upload file + thumbnail)
7.  GET  /videos                             ← List all videos
8.  GET  /videos/:videoId                    ← View uploaded video
9.  POST /tweets                             ← Create a tweet
10. POST /comments/:videoId                  ← Comment on the video
11. POST /likes/toggle/v/:videoId            ← Like the video
12. POST /likes/toggle/c/:commentId          ← Like the comment
13. POST /likes/toggle/t/:tweetId            ← Like the tweet
14. GET  /likes/videos                       ← View liked videos
15. POST /playlists                          ← Create a playlist
16. PATCH /playlists/add/:videoId/:playlistId ← Add video to playlist
17. POST /subscriptions/c/:channelId         ← Subscribe to a channel
18. GET  /subscriptions/c/:channelId/subscribers ← View subscribers
19. GET  /dashboard/stats                    ← Channel analytics
20. GET  /dashboard/videos                   ← Channel video list
21. PATCH /users/update-account              ← Update profile
22. POST /users/change-password              ← Change password
23. POST /users/refresh-token                ← Refresh access token
24. GET  /users/watch-history                ← View watch history
25. POST /users/logout                       ← Logout (clears tokens)
```

---

## 📖 API Reference

### Base URLs

| Environment | Base URL                                                             | Status |
|-------------|----------------------------------------------------------------------|--------|
| **Local**   | `http://localhost:8000/api/v1`                                      | Development |
| **Deployed** | `https://video-sharing-and-social-media-platform.onrender.com/api/v1` | Production |

> 🔒 = Requires Bearer Token in `Authorization` header (auto-handled by Postman collection)

---

### 1. Health Check

| Method | Endpoint       | Auth | Description        |
|--------|----------------|------|--------------------|
| GET    | `/healthcheck` | ❌   | Check server status |

---

### 2. Users

| Method | Endpoint                    | Auth | Description                        |
|--------|-----------------------------|------|------------------------------------|
| POST   | `/users/register`           | ❌   | Register a new user (`multipart/form-data` — include `avatar` file) |
| POST   | `/users/login`              | ❌   | Login and receive access + refresh tokens |
| POST   | `/users/logout`             | 🔒   | Logout and invalidate tokens       |
| POST   | `/users/refresh-token`      | ❌   | Get a new access token using refresh token |
| GET    | `/users/current-user`       | 🔒   | Get the logged-in user's profile   |
| PATCH  | `/users/update-account`     | 🔒   | Update `fullname` and `email`      |
| PATCH  | `/users/update-avatar`      | 🔒   | Upload a new avatar image          |
| PATCH  | `/users/update-cover`       | 🔒   | Upload a new cover image           |
| POST   | `/users/change-password`    | 🔒   | Change the current user's password |
| GET    | `/users/channel/:username`  | ❌   | Get public channel profile         |
| GET    | `/users/watch-history`      | 🔒   | Get the authenticated user's watch history |

#### Register Request Body (`form-data`)
```
fullname    : Test User
email       : testuser@example.com
username    : testuser
password    : Password@123
avatar      : [FILE]          ← required
coverImage  : [FILE]          ← optional
```

#### Login Request Body (`JSON`)
```json
{
  "email": "testuser@example.com",
  "password": "Password@123"
}
```

---

### 3. Videos

All video routes require authentication.

| Method | Endpoint                          | Auth | Description                        |
|--------|-----------------------------------|------|------------------------------------|
| GET    | `/videos`                         | 🔒   | Get all videos (paginated)         |
| POST   | `/videos`                         | 🔒   | Publish a new video (form-data)    |
| GET    | `/videos/:videoId`                | 🔒   | Get video details by ID            |
| PATCH  | `/videos/:videoId`                | 🔒   | Update video title/description/thumbnail |
| DELETE | `/videos/:videoId`                | 🔒   | Delete a video                     |
| PATCH  | `/videos/toggle/publish/:videoId` | 🔒   | Toggle published/unpublished state |

#### Get All Videos — Query Parameters
| Param      | Type   | Default     | Description              |
|------------|--------|-------------|--------------------------|
| `page`     | number | `1`         | Page number              |
| `limit`    | number | `10`        | Results per page         |
| `query`    | string | —           | Search by title          |
| `sortBy`   | string | `createdAt` | Field to sort by         |
| `sortType` | string | `desc`      | `asc` or `desc`          |
| `userId`   | string | —           | Filter by owner          |

#### Publish Video — Request Body (`form-data`)
```
videoFile   : [FILE]        ← required
thumbnail   : [FILE]        ← required
title       : My First Video
description : A test video
isPublished : true
```

---

### 4. Comments

| Method | Endpoint                  | Auth | Description                      |
|--------|---------------------------|------|----------------------------------|
| GET    | `/comments/:videoId`      | 🔒   | Get all comments for a video     |
| POST   | `/comments/:videoId`      | 🔒   | Add a comment to a video         |
| PATCH  | `/comments/c/:commentId`  | 🔒   | Edit your comment                |
| DELETE | `/comments/c/:commentId`  | 🔒   | Delete your comment              |

#### Add / Update Comment — Request Body (`JSON`)
```json
{
  "content": "Great video!"
}
```

---

### 5. Likes

| Method | Endpoint                        | Auth | Description                        |
|--------|---------------------------------|------|------------------------------------|
| POST   | `/likes/toggle/v/:videoId`      | 🔒   | Like/Unlike a video                |
| POST   | `/likes/toggle/c/:commentId`    | 🔒   | Like/Unlike a comment              |
| POST   | `/likes/toggle/t/:tweetId`      | 🔒   | Like/Unlike a tweet                |
| GET    | `/likes/videos`                 | 🔒   | Get all videos liked by the user   |

> Likes toggle — calling the same endpoint twice removes the like.

---

### 6. Tweets

| Method | Endpoint                  | Auth | Description            |
|--------|---------------------------|------|------------------------|
| POST   | `/tweets`                 | 🔒   | Create a tweet         |
| GET    | `/tweets/user/:userId`    | 🔒   | Get all tweets by user |
| PATCH  | `/tweets/:tweetId`        | 🔒   | Update a tweet         |
| DELETE | `/tweets/:tweetId`        | 🔒   | Delete a tweet         |

#### Create / Update Tweet — Request Body (`JSON`)
```json
{
  "content": "Hello from the API!"
}
```

---

### 7. Playlists

| Method | Endpoint                                  | Auth | Description                   |
|--------|-------------------------------------------|------|-------------------------------|
| POST   | `/playlists`                              | 🔒   | Create a new playlist         |
| GET    | `/playlists/user/:userId`                 | 🔒   | Get all playlists of a user   |
| GET    | `/playlists/:playlistId`                  | 🔒   | Get playlist details          |
| PATCH  | `/playlists/:playlistId`                  | 🔒   | Update playlist name / description |
| DELETE | `/playlists/:playlistId`                  | 🔒   | Delete a playlist             |
| PATCH  | `/playlists/add/:videoId/:playlistId`     | 🔒   | Add a video to a playlist     |
| PATCH  | `/playlists/remove/:videoId/:playlistId`  | 🔒   | Remove a video from a playlist|

#### Create / Update Playlist — Request Body (`JSON`)
```json
{
  "name": "My Favourites",
  "description": "Videos I love"
}
```

---

### 8. Subscriptions

| Method | Endpoint                              | Auth | Description                        |
|--------|---------------------------------------|------|------------------------------------|
| POST   | `/subscriptions/c/:channelId`                    | 🔒   | Subscribe / Unsubscribe a channel  |
| GET    | `/subscriptions/c/:channelId/subscribers`        | 🔒   | Get all subscribers of a channel   |
| GET    | `/subscriptions/u/:subscriberId/channels`        | 🔒   | Get all channels a user subscribes |

> Subscription toggles — calling the same endpoint twice unsubscribes.

---

### 9. Dashboard

| Method | Endpoint              | Auth | Description                            |
|--------|-----------------------|------|----------------------------------------|
| GET    | `/dashboard/stats`    | 🔒   | Get channel stats (views, subs, videos, likes) |
| GET    | `/dashboard/videos`   | 🔒   | Get all videos uploaded by the channel |

---

## 🔑 Authentication

This API uses a **dual-token JWT strategy**:

| Token          | Lifetime | Sent via                      | Purpose                             |
|----------------|----------|-------------------------------|-------------------------------------|
| `accessToken`  | 1 day    | `Authorization: Bearer <token>` header | Authenticate each request |
| `refreshToken` | 10 days  | HTTP-only cookie + response body | Issue a new access token when it expires |

**To authenticate a request manually:**
```
Header: Authorization: Bearer <your_accessToken>
```

**To refresh a token:**
```bash
POST /api/v1/users/refresh-token
Body: { "refreshToken": "<your_refreshToken>" }
```

---

## 📦 Response Format

All responses follow a consistent envelope structure:

```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Operation completed successfully",
  "success": true
}
```

**Error response:**
```json
{
  "statusCode": 400,
  "data": null,
  "message": "All fields are required",
  "success": false
}
```

---

## ⚠️ Common Error Codes

| Status | Meaning                                                        |
|--------|----------------------------------------------------------------|
| `400`  | Bad request — missing or invalid fields                        |
| `401`  | Unauthorized — token missing, expired, or invalid             |
| `403`  | Forbidden — authenticated but not allowed to perform this action |
| `404`  | Resource not found                                             |
| `409`  | Conflict — e.g., email/username already exists                 |
| `500`  | Internal server error                                          |

---

## 📁 Project Structure

```
video-sharing-and-social-media-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express route definitions
│   │   ├── middlewares/     # Auth (JWT) + Multer upload
│   │   ├── utils/           # ApiError, ApiResponse, Cloudinary helpers
│   │   ├── db/              # MongoDB connection
│   │   ├── app.js           # Express app setup
│   │   └── index.js         # Server entry point
│   ├── docs/
│   │   └── api/             # Per-feature API docs
│   └── VideoSocialPlatform.postman_collection.json  ← Import this!
├── frontend/                # React + Vite (UI)
└── README.md
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📬 Contact

Built by **Challa Pranav Chandan** — feel free to connect on [LinkedIn](https://www.linkedin.com/in/challa007) or raise an issue on GitHub.

> ⭐ If you find this project useful, please give it a star on GitHub!
