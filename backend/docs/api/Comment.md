# Comment API Documentation

Base URL: `/api/v1/comments`

## Endpoints

### 1. Get Video Comments
- **URL**: `/:videoId`
- **Method**: `GET`
- **Authentication**: Required (JWT)
- **Description**: Returns all comments for a specific video.

### 2. Add Comment
- **URL**: `/:videoId`
- **Method**: `POST`
- **Authentication**: Required (JWT)
- **Request Body** (JSON):
  - `content`: String (Required)
- **Frontend Integration (Axios)**:
```javascript
const response = await axios.post(`/api/v1/comments/${videoId}`, {
    content: "Great video!"
});
```

### 3. Update Comment
- **URL**: `/c/:commentId`
- **Method**: `PATCH`
- **Authentication**: Required (JWT)
- **Request Body** (JSON):
  - `content`: String (Required)

### 4. Delete Comment
- **URL**: `/c/:commentId`
- **Method**: `DELETE`
- **Authentication**: Required (JWT)
- **Description**: Deletes a specific comment.
