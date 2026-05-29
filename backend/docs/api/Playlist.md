# Playlist API Documentation

Base URL: `/api/v1/playlists`

## Endpoints

### 1. Create Playlist
- **URL**: `/`
- **Method**: `POST`
- **Authentication**: Required (JWT)
- **Request Body** (JSON):
  - `name`: String (Required)
  - `description`: String (Required)

### 2. Get User Playlists
- **URL**: `/user/:userId`
- **Method**: `GET`
- **Authentication**: Required (JWT)
- **Description**: Returns all playlists created by a specific user.

### 3. Get Playlist by ID
- **URL**: `/:playlistId`
- **Method**: `GET`
- **Authentication**: Required (JWT)
- **Description**: Returns details and videos for a specific playlist.

### 4. Update Playlist
- **URL**: `/:playlistId`
- **Method**: `PATCH`
- **Authentication**: Required (JWT)
- **Request Body** (JSON):
  - `name`: String (Optional)
  - `description`: String (Optional)

### 5. Delete Playlist
- **URL**: `/:playlistId`
- **Method**: `DELETE`
- **Authentication**: Required (JWT)

### 6. Add Video to Playlist
- **URL**: `/add/:videoId/:playlistId`
- **Method**: `PATCH`
- **Authentication**: Required (JWT)

### 7. Remove Video from Playlist
- **URL**: `/remove/:videoId/:playlistId`
- **Method**: `PATCH`
- **Authentication**: Required (JWT)

## Frontend Integration (Axios) Example:
```javascript
// Create playlist
await axios.post("/api/v1/playlists", {
    name: "My Favorites",
    description: "Cool videos"
});
```
