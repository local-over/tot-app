# TOT AI Agent API

This document describes how you (the AI Agent) can programmatically interact with the TOT API to publish new articles, edit existing ones, and monitor user feedback.

## Authentication

All API endpoints that modify data (POST, PUT) require an API key to be passed in the `Authorization` header.

```http
Authorization: Bearer tot_dev_key_2024
```

> **Note**: For local development, if no auth secret is set in `.env.local`, the server will check for `Bearer null` or whatever the environment variable is configured to. Ask the human admin for the production API key.

## Endpoints

### 1. Fetch All Articles
Fetch all published articles in the database.

**Request:**
`GET https://theonetopic.me/api/topics`

**Optional Query Params:**
- `category` (string): Filter by a specific category id (e.g. `science`, `history`)
- `vibe` (string): Filter by a specific vibe (e.g. `fun`, `practical`)
- `includeStats` (boolean): Pass `true` to include feedback analytics for each topic (`stats.avgRating`, `stats.feedbackCount`, etc.). This is extremely useful for generating reports on which topics are underperforming before deleting them.

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
`GET https://theonetopic.me/api/topics/{id}`

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
`POST https://theonetopic.me/api/topics`
```http
Authorization: Bearer tot_dev_key_2024
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
`PUT https://theonetopic.me/api/topics/{id}`
```http
Authorization: Bearer tot_dev_key_2024
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

### 5. Delete an Article
Delete an article from the database entirely.

**Request:**
`DELETE https://theonetopic.me/api/topics/{id}`
```http
Authorization: Bearer tot_dev_key_2024
```

**Response:**
```json
{
  "success": true
}
```

## Default Categories and Vibes

When assigning a `categoryId` or `vibe` to a new topic, you **MUST** use one of the predefined IDs below.

**Valid Category IDs:**
- `science` (Science & Nature)
- `technology` (Technology & AI)
- `history` (History)
- `psychology` (Psychology & Mind)
- `business` (Business & Money)
- `health` (Health & Body)
- `art` (Art & Design)
- `philosophy` (Philosophy)
- `world` (World & Society)
- `food` (Food & Travel)
- `sports` (Sports)
- `entertainment` (Entertainment)

**Valid Vibes:**
- `fun` (Fun & weird)
- `practical` (Practical stuff)
- `think` (Make me think)
- `learn` (Teach me)

### Writing Cross-Articles

The system only supports passing a **single** primary `categoryId` string. However, you are highly encouraged to write **cross-articles** that span multiple subjects (e.g., an article that combines `technology` and `business`). 

When you write a cross-article, you should:
1. Write the content to appeal to multiple interests.
2. For the `categoryId` field, simply pass the **primary** category ID that fits best, or safely pass a comma-separated string like `"technology, business"`. The frontend will gracefully fallback if the exact string doesn't perfectly match a single icon, so multi-string categories are allowed!

## Reading Lengths (readTime)

When creating or editing an article, the `readTime` field must be an integer representing the estimated reading time in minutes. Try to generate articles that fit into these general buckets based on user preferences:

- **Quick bites (Small):** `4` to `7` minutes.
- **Average (Mix):** `7` to `10` minutes.
- **Deep dives (Long):** `10` to `14` minutes.
