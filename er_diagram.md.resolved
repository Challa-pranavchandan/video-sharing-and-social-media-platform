# 📊 ER Diagram — Video Sharing & Social Media Platform

> Generated from the Mongoose model definitions in `backend/src/models/`.

```mermaid
erDiagram

    USER {
        ObjectId _id PK
        string username UK
        string email UK
        string fullname
        string avatar
        string coverImage
        ObjectId[] watchHistory FK
        string password
        string refreshToken
        date createdAt
        date updatedAt
    }

    VIDEO {
        ObjectId _id PK
        string videoFile
        string thumbnail
        string title
        string description
        number duration
        number views
        boolean isPublished
        ObjectId owner FK
        date createdAt
        date updatedAt
    }

    COMMENT {
        ObjectId _id PK
        string content
        ObjectId video FK
        ObjectId owner FK
        date createdAt
        date updatedAt
    }

    TWEET {
        ObjectId _id PK
        string content
        ObjectId owner FK
        date createdAt
        date updatedAt
    }

    LIKE {
        ObjectId _id PK
        ObjectId video FK
        ObjectId comment FK
        ObjectId tweet FK
        ObjectId likedBy FK
        date createdAt
        date updatedAt
    }

    PLAYLIST {
        ObjectId _id PK
        string name
        string description
        ObjectId[] videos FK
        ObjectId owner FK
        date createdAt
        date updatedAt
    }

    SUBSCRIPTION {
        ObjectId _id PK
        ObjectId subscriber FK
        ObjectId channel FK
        date createdAt
        date updatedAt
    }

    %% ── Relationships ──────────────────────────────────────

    USER ||--o{ VIDEO         : "uploads (owner)"
    USER ||--o{ COMMENT       : "writes (owner)"
    USER ||--o{ TWEET         : "posts (owner)"
    USER ||--o{ LIKE          : "likes (likedBy)"
    USER ||--o{ PLAYLIST      : "creates (owner)"
    USER }o--o{ VIDEO         : "watchHistory"

    USER ||--o{ SUBSCRIPTION  : "subscribes as (subscriber)"
    USER ||--o{ SUBSCRIPTION  : "receives as (channel)"

    VIDEO ||--o{ COMMENT      : "has (video)"
    VIDEO ||--o{ LIKE         : "liked via (video)"
    VIDEO }o--o{ PLAYLIST     : "added to (videos[])"

    COMMENT ||--o{ LIKE       : "liked via (comment)"
    TWEET   ||--o{ LIKE       : "liked via (tweet)"
```

---

## 🗂️ Entity Summary

| Entity | Collection | Description |
|:---|:---|:---|
| **User** | `users` | Platform accounts — own videos, tweets, playlists |
| **Video** | `videos` | Uploaded videos with Cloudinary URL |
| **Comment** | `comments` | User comments on a video |
| **Tweet** | `tweets` | Short text posts by a user |
| **Like** | `likes` | Polymorphic like — targets a Video, Comment, or Tweet |
| **Playlist** | `playlists` | Named collection of videos owned by a user |
| **Subscription** | `subscriptions` | Maps a `subscriber` (User) → `channel` (User) |

---

## 🔗 Relationship Notes

- **Like is polymorphic**: A single `Like` document references exactly one of `video`, `comment`, or `tweet` — the other two fields are `null`.
- **Subscription is self-referential on User**: Both `subscriber` and `channel` are `ObjectId` references back to the `User` collection.
- **watchHistory** is an embedded array of `Video` ObjectId references stored directly on the `User` document.
- **Playlist → videos** is an embedded array of `Video` ObjectId references, allowing many videos per playlist.
