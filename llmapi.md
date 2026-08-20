# TOT AI Agent API

This document describes how you (the AI Agent) can programmatically interact with the TOT API to publish new articles, edit existing ones, and monitor user feedback.

## Authentication

All API endpoints that modify data (POST, PUT) require an API key to be passed in the `Authorization` header.

```http
Authorization: Bearer YOUR_API_KEY
```

> **Note**: For local development, if no auth secret is set in `.env.local`, the server will check for `Bearer null` or whatever the environment variable is configured to. Ask the human admin for the production API key.

## Endpoints

### 1. Fetch All Articles
Fetch all published articles in the database.

**Request:**
`GET https://tot-app.pages.dev/api/topics`

**Optional Query Params:**
- `category` (string): Filter by a specific category id (e.g. `science`, `history`)
- `vibe` (string): Filter by vibe (e.g. `fun`, `learn`, `deep`)

**Response:**
Returns an array of topic objects.
```json
[
  {
    "id": "sci-001",
    "title": "Why Saturn's Rings Are Disappearing",
    "categoryId": "science",
    "readTime": 4,
    "vibe": "learn",
    "body": ["Paragraph 1", "Paragraph 2"],
    "closingFact": "A fun fact.",
    "imageUrl": "https://example.com/image.jpg",
    "resources": ["https://source1.com"]
  }
]
```

### 2. Fetch a Single Article with Feedback
Fetch a specific article and view all the ratings it has received from users. This is useful for identifying poorly performing articles that need to be rewritten.

**Request:**
`GET https://tot-app.pages.dev/api/topics/{id}`

**Response:**
```json
{
  "id": "sci-001",
  "title": "Why Saturn's Rings Are Disappearing",
  ...
  "feedback": [
    {
      "userId": "user_123",
      "rating": 2,
      "moreOrLess": "less",
      "length": "too_long"
    }
  ]
}
```

### 3. Create a New Article
Publish a new article to the platform.

**Request:**
`POST https://tot-app.pages.dev/api/topics`
```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```
```json
{
  "title": "The First Computer Bug Was an Actual Bug",
  "categoryId": "technology",
  "readTime": 3,
  "vibe": "fun",
  "body": [
    "On September 9, 1947, a team at Harvard found that their Mark II computer was producing errors...",
    "The term 'bug' for a technical glitch already existed, but this was the first literal one."
  ],
  "closingFact": "Grace Hopper was the oldest serving officer in the US Navy when she retired at age 79.",
  "imageUrl": "https://url.to/image.jpg",
  "resources": ["https://en.wikipedia.org/wiki/Software_bug"]
}
```

### 4. Edit an Existing Article
Rewrite or update an article, for example, if user feedback indicates it was too long or boring.

**Request:**
`PUT https://tot-app.pages.dev/api/topics/{id}`
```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```
```json
{
  "body": [
    "This is the completely rewritten, shorter body.",
    "It addresses the feedback perfectly."
  ],
  "readTime": 2
}
```
*Note: You only need to send the fields you wish to update.*
