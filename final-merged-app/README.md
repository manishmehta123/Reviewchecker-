# VibeCheck Image Battle (Full Stack)

React + Express + MongoDB app where registered users upload **two images** to create a *battle*.
Visitors can rate both sides (0–5 stars), leave comments, see winner, and review stats chart.

## Quick Start

### 1) Backend
```bash
cd backend
npm i
# MONGO_URI already set in backend/.env as requested
npm start
```

### 2) Frontend
In another terminal:
```bash
cd ../frontend
npm i
npm run dev
```

- Open the frontend on http://localhost:5173 (during dev).
- Backend runs on http://localhost:5000 and also serves images from `/uploads`.

> In production, build the frontend (`npm run build`) and serve from the backend automatically.

## API Overview

- `POST /api/auth/signup` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }` → `{ token, user }`
- `POST /api/battles` *(auth, multipart)* fields: `title, leftCaption, rightCaption, leftImage, rightImage`
- `GET /api/battles` → list with `{ stats: { avgLeft, avgRight, reviews, winner } }`
- `GET /api/battles/:id/reviews`
- `POST /api/battles/:id/reviews` *(auth)* `{ ratingLeft, ratingRight, comment }` *(1 review per user per battle)*
- `DELETE /api/battles/:id/reviews` *(auth, owner)* clear all reviews for your own battle

## Winner Algorithm

1. Compute averages: `avgLeft`, `avgRight` across all reviews.
2. If one avg is higher → that side is **Winner**.
3. If averages equal and there are reviews → **Tie**.
4. If no reviews → **Draw**.

Tiebreakers can be extended to use median or count; the code is modular for adjustments.

## Security Notes

- Passwords are hashed (bcrypt).
- JWT auth with 7d expiry.
- Only owner can clear reviews for their battle.
- Multer stores images to `backend/uploads/` (local). Switch to S3/Cloudinary if needed.
