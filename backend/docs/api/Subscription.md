# Subscription API Documentation

Base URL: `/api/v1/subscriptions`

## Endpoints

### 1. Toggle Subscription
- **URL**: `/c/:channelId`
- **Method**: `POST`
- **Authentication**: Required (JWT)
- **Description**: Subscribes or unsubscribes to a channel.

### 2. Get Channel Subscribers
- **URL**: `/c/:channelId/subscribers`
- **Method**: `GET`
- **Authentication**: Required (JWT)
- **Description**: Returns all subscribers of a specific channel.

### 3. Get Subscribed Channels
- **URL**: `/u/:subscriberId/channels`
- **Method**: `GET`
- **Authentication**: Required (JWT)
- **Description**: Returns all channels a specific user has subscribed to.

## Frontend Integration (Axios) Example:
```javascript
// Toggle subscription
await axios.post(`/api/v1/subscriptions/c/${channelId}`);
```
