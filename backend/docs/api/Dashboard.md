# Dashboard API Documentation

Base URL: `/api/v1/dashboard`

## Endpoints

### 1. Get Channel Stats
- **URL**: `/stats`
- **Method**: `GET`
- **Authentication**: Required (JWT)
- **Description**: Returns total views, subscribers, videos, and likes for the logged-in user's channel.

### 2. Get Channel Videos
- **URL**: `/videos`
- **Method**: `GET`
- **Authentication**: Required (JWT)
- **Description**: Returns all videos uploaded by the logged-in user for their dashboard.

## Frontend Integration (Axios) Example:
```javascript
// Get stats
const stats = await axios.get("/api/v1/dashboard/stats");
```
