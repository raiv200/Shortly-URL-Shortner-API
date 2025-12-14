# URL Shortener API

## Overview
This project is a URL Shortener API built with Node.js, Express, and MongoDB. It allows users to shorten URLs, track analytics such as visit history and total clicks, and generate QR codes for the shortened URLs. The API is designed to be simple, efficient, and extensible.

## Features
- Generate short URLs for long URLs.
- Redirect users to the original URL using the short ID.
- Track visit history and total clicks for each short URL.
- Generate QR codes for the shortened URLs.
- Retrieve analytics for a specific short URL.

## API Endpoints

### 1. **Generate Short URL**
**POST** `/url`

#### Request Body:
```json
{
  "url": "https://example.com"
}
```

#### Response:
```json
{
  "id": "abc12345",
  "qrCode": "data:image/png;base64,..."
}
```
- `id`: The unique short ID for the URL.
- `qrCode`: A Base64-encoded QR code image for the shortened URL.

### 2. **Redirect to Original URL**
**GET** `/:shortId`

#### Description:
Redirects the user to the original URL associated with the given `shortId`.

#### Example:
Visiting `http://localhost:8001/abc12345` will redirect to `https://example.com`.

### 3. **Get URL Analytics**
**GET** `/url/analytics/:shortId`

#### Response:
```json
{
  "totalVisits": 5,
  "analytics": [
    { "timestamp": 1671234567890 },
    { "timestamp": 1671235567890 }
  ]
}
```
- `totalVisits`: Total number of times the short URL has been visited.
- `analytics`: An array of visit history timestamps.

### 4. **Update URL**
**PUT** `/url/update/:shortId`

#### Request Body:
```json
{
  "url": "https://new-example.com"
}
```

#### Response:
```json
{
  "message": "URL updated successfully"
}
```
- Updates the original URL associated with the given `shortId`.



## Database Schema

### URL Schema
```javascript
const urlSchema = new Schema({
  shortID: { type: String, required: true, unique: true },
  redirectURL: { type: String, required: true },
  visitHistory: [{ timestamp: { type: Number } }],
  created_at: { type: Date, default: Date.now }
}, { timestamps: true });
```
- `shortID`: Unique identifier for the shortened URL.
- `redirectURL`: The original URL to redirect to.
- `visitHistory`: Array of timestamps representing each visit.
- `created_at`: The date the short URL was created.

## How to Run

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run server
   ```

4. The server will run at `http://localhost:8001`.

## Frontend Integration

This API can be used to build a frontend web application. The following information can be passed to the frontend:
- **API Endpoints**: Details of the routes listed above.
- **QR Code**: The `qrCode` field in the response can be directly displayed as an image.
- **Analytics**: The `analytics` data can be visualized using charts or tables.

## Example Workflow
1. User submits a long URL via the frontend.
2. The frontend sends a `POST` request to `/url`.
3. The API responds with a short ID and QR code.
4. The frontend displays the short URL and QR code to the user.
5. The user shares the short URL.
6. The frontend can fetch analytics data from `/url/analytics/:shortId` to display visit statistics.

---

Feel free to extend this API with additional features like user authentication, custom short URLs, or expiration dates for links.