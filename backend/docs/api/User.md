# User API Documentation

Base URL: `/api/v1/users`

## Endpoints

### 1. Register User
- **URL**: `/register`
- **Method**: `POST`
- **Description**: Registers a new user with avatar and optional cover image.
- **Request Body** (Form Data):
  - `username`: String (Required, Unique)
  - `email`: String (Required, Unique)
  - `fullName`: String (Required)
  - `password`: String (Required)
  - `avatar`: File (Required)
  - `coverImage`: File (Optional)
- **Frontend Integration (Axios)**:
```javascript
const formData = new FormData();
formData.append("username", username);
formData.append("email", email);
formData.append("fullName", fullName);
formData.append("password", password);
formData.append("avatar", avatarFile);
if (coverImageFile) formData.append("coverImage", coverImageFile);

const response = await axios.post("/api/v1/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" }
});
```

### 2. Login User
- **URL**: `/login`
- **Method**: `POST`
- **Description**: Authenticates a user and returns access/refresh tokens.
- **Request Body** (JSON):
  - `email` or `username`: String
  - `password`: String
- **Frontend Integration (Axios)**:
```javascript
const response = await axios.post("/api/v1/users/login", {
    email,
    password
});
```

### 3. Logout User
- **URL**: `/logout`
- **Method**: `POST`
- **Authentication**: Required (JWT)
- **Description**: Logs out the current user.
- **Frontend Integration (Axios)**:
```javascript
await axios.post("/api/v1/users/logout", {}, {
    withCredentials: true // If using cookies
});
```

### 4. Refresh Access Token
- **URL**: `/refresh-token`
- **Method**: `POST`
- **Description**: Generates a new access token using a valid refresh token.
- **Frontend Integration (Axios)**:
```javascript
const response = await axios.post("/api/v1/users/refresh-token");
```

### 5. Change Password
- **URL**: `/change-password`
- **Method**: `POST`
- **Authentication**: Required (JWT)
- **Request Body** (JSON):
  - `oldPassword`: String
  - `newPassword`: String
- **Frontend Integration (Axios)**:
```javascript
await axios.post("/api/v1/users/change-password", {
    oldPassword,
    newPassword
});
```

### 6. Get Current User
- **URL**: `/current-user`
- **Method**: `GET`
- **Authentication**: Required (JWT)
- **Description**: Returns details of the logged-in user.

### 7. Update Account Details
- **URL**: `/update-account`
- **Method**: `PATCH`
- **Authentication**: Required (JWT)
- **Request Body** (JSON):
  - `fullName`: String (Optional)
  - `email`: String (Optional)

### 8. Update Avatar
- **URL**: `/update-avatar`
- **Method**: `PATCH`
- **Authentication**: Required (JWT)
- **Request Body** (Form Data):
  - `avatar`: File (Required)

### 9. Update Cover Image
- **URL**: `/update-cover`
- **Method**: `PATCH`
- **Authentication**: Required (JWT)
- **Request Body** (Form Data):
  - `coverImage`: File (Required)

### 10. Get Channel Profile
- **URL**: `/channel/:username`
- **Method**: `GET`
- **Description**: Returns public profile information for a specific channel.

### 11. Get Watch History
- **URL**: `/watch-history`
- **Method**: `GET`
- **Authentication**: Required (JWT)
- **Description**: Returns the current user's video watch history.
