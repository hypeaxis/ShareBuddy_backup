# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A",
  "school": "HUST",
  "major": "Computer Science"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "Nguyễn Văn A",
      "role": "user",
      "credits": 10
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /auth/me
```
**Headers:** Authorization required

---

## Document Endpoints

### Get All Documents
```http
GET /documents?search=math&school=HUST&subject=Calculus&page=1&limit=12
```

**Query Parameters:**
- `search` - Search term
- `school` - Filter by school
- `subject` - Filter by subject
- `tag` - Filter by tag
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `sortBy` - Sort field (createdAt, downloadCount, averageRating, viewCount)
- `order` - Sort order (ASC, DESC)

### Get Document by ID
```http
GET /documents/:id
```

### Upload Document
```http
POST /documents
```
**Headers:** Authorization required
**Content-Type:** multipart/form-data

**Form Data:**
- `file` - Document file (required)
- `title` - Document title (required)
- `description` - Description
- `school` - School name
- `subject` - Subject name
- `tags` - Comma-separated tags
- `accessType` - public/private/premium
- `creditCost` - Cost in credits (for premium)

### Download Document
```http
GET /documents/:id/download
```
**Headers:** Authorization required

### Delete Document
```http
DELETE /documents/:id
```
**Headers:** Authorization required

---

## Comment Endpoints

### Get Document Comments
```http
GET /comments/document/:documentId
```

### Add Comment
```http
POST /comments
```
**Headers:** Authorization required

**Request Body:**
```json
{
  "documentId": 1,
  "content": "Great document!",
  "rating": 5
}
```

### Delete Comment
```http
DELETE /comments/:id
```
**Headers:** Authorization required

---

## User Endpoints

### Get User Profile
```http
GET /users/:id
```

### Update Profile
```http
PUT /users/profile
```
**Headers:** Authorization required

**Request Body:**
```json
{
  "fullName": "Updated Name",
  "bio": "My bio",
  "school": "HUST",
  "major": "CS"
}
```

### Change Password
```http
PUT /users/password
```
**Headers:** Authorization required

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

### Get My Documents
```http
GET /users/my/documents
```
**Headers:** Authorization required

### Get Download History
```http
GET /users/my/downloads
```
**Headers:** Authorization required

---

## Bookmark Endpoints

### Get Bookmarks
```http
GET /bookmarks
```
**Headers:** Authorization required

### Add Bookmark
```http
POST /bookmarks
```
**Headers:** Authorization required

**Request Body:**
```json
{
  "documentId": 1
}
```

### Remove Bookmark
```http
DELETE /bookmarks/:documentId
```
**Headers:** Authorization required

---

## Follow Endpoints

### Follow User
```http
POST /follows
```
**Headers:** Authorization required

**Request Body:**
```json
{
  "userId": 2
}
```

### Unfollow User
```http
DELETE /follows/:userId
```
**Headers:** Authorization required

### Get Followers
```http
GET /follows/followers
```
**Headers:** Authorization required

### Get Following
```http
GET /follows/following
```
**Headers:** Authorization required

### Get Following Feed
```http
GET /follows/feed
```
**Headers:** Authorization required

---

## Credit Endpoints

### Get Transactions
```http
GET /credits/transactions
```
**Headers:** Authorization required

### Purchase Credits
```http
POST /credits/purchase
```
**Headers:** Authorization required

**Request Body:**
```json
{
  "amount": 100
}
```

---

## Report Endpoints

### Create Report
```http
POST /reports
```
**Headers:** Authorization required

**Request Body:**
```json
{
  "documentId": 1,
  "reason": "Copyright violation",
  "description": "This document contains copyrighted material"
}
```

### Get Reports (Admin/Moderator)
```http
GET /reports?status=pending
```
**Headers:** Authorization required (Admin/Moderator)

### Update Report (Admin/Moderator)
```http
PUT /reports/:id
```
**Headers:** Authorization required (Admin/Moderator)

**Request Body:**
```json
{
  "status": "resolved",
  "reviewNote": "Document removed"
}
```

---

## Admin Endpoints

### Get Dashboard Stats
```http
GET /admin/stats
```
**Headers:** Authorization required (Admin/Moderator)

### Get All Users
```http
GET /admin/users?page=1&limit=20
```
**Headers:** Authorization required (Admin)

### Update User Role
```http
PUT /admin/users/:id/role
```
**Headers:** Authorization required (Admin)

**Request Body:**
```json
{
  "role": "moderator"
}
```

### Delete User
```http
DELETE /admin/users/:id
```
**Headers:** Authorization required (Admin)

### Get All Documents (Moderation)
```http
GET /admin/documents?status=pending&page=1&limit=20
```
**Headers:** Authorization required (Admin/Moderator)

### Update Document Status
```http
PUT /admin/documents/:id/status
```
**Headers:** Authorization required (Admin/Moderator)

**Request Body:**
```json
{
  "status": "approved"
}
```

---

## Error Responses

All endpoints may return these error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Invalid input data",
  "errors": [...]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Token is invalid or expired"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```
