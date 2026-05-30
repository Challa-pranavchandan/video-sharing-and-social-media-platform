# Backend Documentation

> 📊 **[View ER Diagram](./docs/ER_DIAGRAM.md)** — Full database schema and entity relationships.

This directory contains the server-side logic for the Video-Sharing Platform.

## 🚀 Live Deployment
**API Base URL:** https://video-sharing-and-social-media-platform.onrender.com
- **API Documentation:** https://video-sharing-and-social-media-platform.onrender.com/
- **Health Check:** https://video-sharing-and-social-media-platform.onrender.com/api/v1/healthcheck

## Quick Start
1. `npm install`
2. Configure `.env` (see root README for details)
3. Development: `npm run dev` (runs on `http://localhost:8000`)
4. Production: `npm run start`

## Detailed API Documentation
The API is divided into several modules. Detailed documentation, including request/response formats and frontend integration examples, can be found in the [docs/api](./docs/api) folder:

- [User API](./docs/api/User.md)
- [Video API](./docs/api/Video.md)
- [Comment API](./docs/api/Comment.md)
- [Like API](./docs/api/Like.md)
- [Playlist API](./docs/api/Playlist.md)
- [Tweet API](./docs/api/Tweet.md)
- [Subscription API](./docs/api/Subscription.md)
- [Dashboard API](./docs/api/Dashboard.md)
- [Healthcheck API](./docs/api/Healthcheck.md)
