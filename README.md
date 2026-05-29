# Video-Sharing and Social Media Platform

> 📊 **[View ER Diagram](backend/docs/ER_DIAGRAM.md)** — Full database schema and entity relationships.

A full-stack video-sharing and social media platform built with Node.js, Express, MongoDB, and React.

## Project Structure
- **/backend**: Express server with MongoDB integration.
- **/frontend**: React + Vite application.

---

## Local Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed or a MongoDB Atlas URI
- Cloudinary account (for image and video storage)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` root and add the following variables:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=http://localhost:5173
   ACCESS_TOKEN_SECRET=your_secret_key
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_secret_key
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## API Documentation

Every API endpoint is documented in detail. You can find the specific documentation for each feature here:

- [User API](backend/docs/api/User.md) - Registration, Login, Profile, History
- [Video API](backend/docs/api/Video.md) - Uploading, Updating, Publishing
- [Comment API](backend/docs/api/Comment.md) - Video comments
- [Like API](backend/docs/api/Like.md) - Liking videos, comments, and tweets
- [Playlist API](backend/docs/api/Playlist.md) - Creating and managing playlists
- [Tweet API](backend/docs/api/Tweet.md) - Posting and managing tweets
- [Subscription API](backend/docs/api/Subscription.md) - Channel subscriptions
- [Dashboard API](backend/docs/api/Dashboard.md) - Channel analytics and video management
- [Healthcheck API](backend/docs/api/Healthcheck.md) - Server status

---

## Frontend Integration Tips
To integrate these APIs with the frontend, we recommend using **Axios**.

### Global Configuration Example:
```javascript
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    withCredentials: true // Important for sending/receiving cookies (JWT)
});

export default apiClient;
```

### Making a Request:
```javascript
import apiClient from './apiClient';

const loginUser = async (data) => {
    try {
        const response = await apiClient.post('/users/login', data);
        return response.data;
    } catch (error) {
        console.error("Login Error:", error.response.data);
    }
};
```
