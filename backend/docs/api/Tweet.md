# Tweet API Documentation

Base URL: `/api/v1/tweets`

## Endpoints

### 1. Create Tweet
- **URL**: `/`
- **Method**: `POST`
- **Authentication**: Required (JWT)
- **Request Body** (JSON):
  - `content`: String (Required)

### 2. Get User Tweets
- **URL**: `/user/:userId`
- **Method**: `GET`
- **Authentication**: Required (JWT)
- **Description**: Returns all tweets for a specific user.

### 3. Update Tweet
- **URL**: `/:tweetId`
- **Method**: `PATCH`
- **Authentication**: Required (JWT)
- **Request Body** (JSON):
  - `content`: String (Required)

### 4. Delete Tweet
- **URL**: `/:tweetId`
- **Method**: `DELETE`
- **Authentication**: Required (JWT)

## Frontend Integration (Axios) Example:
```javascript
// Create tweet
await axios.post("/api/v1/tweets", {
    content: "This is a tweet!"
});
```
