# Like API Documentation

Base URL: `/api/v1/likes`

## Endpoints

### 1. Toggle Video Like
- **URL**: `/toggle/v/:videoId`
- **Method**: `POST`
- **Authentication**: Required (JWT)
- **Description**: Likes or unlikes a video.

### 2. Toggle Comment Like
- **URL**: `/toggle/c/:commentId`
- **Method**: `POST`
- **Authentication**: Required (JWT)
- **Description**: Likes or unlikes a comment.

### 3. Toggle Tweet Like
- **URL**: `/toggle/t/:tweetId`
- **Method**: `POST`
- **Authentication**: Required (JWT)
- **Description**: Likes or unlikes a tweet.

### 4. Get Liked Videos
- **URL**: `/videos`
- **Method**: `GET`
- **Authentication**: Required (JWT)
- **Description**: Returns all videos liked by the current user.

## Frontend Integration (Axios) Example:
```javascript
// Toggle video like
await axios.post(`/api/v1/likes/toggle/v/${videoId}`);

// Get liked videos
const response = await axios.get("/api/v1/likes/videos");
```
