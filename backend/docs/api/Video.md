# Video API Documentation

Base URL: `/api/v1/videos`

## Endpoints

### 1. Get All Videos
- **URL**: `/`
- **Method**: `GET`
- **Authentication**: Required (JWT)
- **Query Params**:
  - `page`: Number (Optional)
  - `limit`: Number (Optional)
  - `query`: String (Optional)
  - `sortBy`: String (Optional)
  - `sortType`: String (Optional)
  - `userId`: String (Optional)
- **Frontend Integration (Axios)**:
```javascript
const response = await axios.get("/api/v1/videos", {
    params: { page: 1, limit: 10, query: "nature" }
});
```

### 2. Publish a Video
- **URL**: `/`
- **Method**: `POST`
- **Authentication**: Required (JWT)
- **Request Body** (Form Data):
  - `title`: String (Required)
  - `description`: String (Required)
  - `videoFile`: File (Required)
  - `thumbnail`: File (Required)
- **Frontend Integration (Axios)**:
```javascript
const formData = new FormData();
formData.append("title", title);
formData.append("description", description);
formData.append("videoFile", videoFile);
formData.append("thumbnail", thumbnailFile);

const response = await axios.post("/api/v1/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" }
});
```

### 3. Get Video by ID
- **URL**: `/:videoId`
- **Method**: `GET`
- **Authentication**: Required (JWT)
- **Description**: Returns details and comments for a specific video.

### 4. Update Video
- **URL**: `/:videoId`
- **Method**: `PATCH`
- **Authentication**: Required (JWT)
- **Request Body** (Form Data/JSON):
  - `title`: String (Optional)
  - `description`: String (Optional)
  - `thumbnail`: File (Optional)

### 5. Delete Video
- **URL**: `/:videoId`
- **Method**: `DELETE`
- **Authentication**: Required (JWT)
- **Description**: Deletes a specific video.

### 6. Toggle Publish Status
- **URL**: `/toggle/publish/:videoId`
- **Method**: `PATCH`
- **Authentication**: Required (JWT)
- **Description**: Toggles the public/private status of a video.
