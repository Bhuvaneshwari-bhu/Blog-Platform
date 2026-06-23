#  Blog Platform — Full-Stack MERN Application

A full-stack blogging platform where users can register, log in, write and manage their own blog posts, like other users' posts, and engage through comments. Built with a clean separation between a React (Vite) frontend and a Node.js/Express REST API backend, using JWT-based authentication and MongoDB for persistence.

🔗 **Live Frontend:** [https://blog-platform-bhu1.vercel.app](https://blog-platform-bhu1.vercel.app)
🔗 **Live Backend API:** [https://blog-platform-ixju.onrender.com](https://blog-platform-ixju.onrender.com)

---

## 📌 About the Project

Blog Platform is a real, deployed, multi-user blogging application — not a static demo. Any visitor can create an account and immediately start publishing posts, liking other users' posts, and commenting on them. The project was built to demonstrate practical, end-to-end full-stack engineering: secure authentication, ownership-based authorization, RESTful API design, and a responsive React frontend consuming that API.

**Core capabilities:**
- User registration and login secured with hashed passwords and JWT tokens
- Full CRUD on blog posts (create, read, update, delete)
- Only the post's original author can edit or delete it — enforced on the backend, not just hidden in the UI
- Like / unlike system on posts
- Commenting system on posts, with delete restricted to the comment's author
- Public user profiles showing bio, interests, and total post count
- Fully responsive UI styled with Tailwind CSS

---

## Architecture

The application follows a **decoupled client-server architecture**. The frontend and backend are independently deployed, communicate only over HTTPS via a REST API, and have no shared code or server-side rendering dependency between them.

```
┌─────────────────────────┐                      ┌──────────────────────────┐
│        CLIENT           │                      │          SERVER          │
│   React + Vite (SPA)    │                      │   Node.js + Express      │
│   Deployed on Vercel    │                      │   Deployed on Render      │
│                          │                      │                          │
│  ┌────────────────────┐  │     HTTPS / REST     │  ┌────────────────────┐  │
│  │ React Router pages │  │  ───────────────────▶ │  │   Express Routes   │  │
│  │ (Home, Post, Auth) │  │   Axios + JWT in      │  │  /api/auth         │  │
│  └─────────┬──────────┘  │   Authorization       │  │  /api/posts        │  │
│            │             │   header              │  │  /api/comments     │  │
│  ┌─────────▼──────────┐  │ ◀───────────────────  │  │  /api/users        │  │
│  │   AuthContext       │  │      JSON responses   │  └─────────┬──────────┘  │
│  │ (token + user in    │  │                      │            │             │
│  │  localStorage)       │  │                      │  ┌─────────▼──────────┐  │
│  └─────────────────────┘  │                      │  │  protect middleware │  │
│                          │                      │  │  (JWT verification) │  │
│                          │                      │  └─────────┬──────────┘  │
│                          │                      │            │             │
│                          │                      │  ┌─────────▼──────────┐  │
│                          │                      │  │     Controllers     │  │
│                          │                      │  │ (business logic)    │  │
│                          │                      │  └─────────┬──────────┘  │
│                          │                      │            │             │
│                          │                      │  ┌─────────▼──────────┐  │
│                          │                      │  │  Mongoose Models    │  │
│                          │                      │  │ User / Post /       │  │
│                          │                      │  │ Comment             │  │
│                          │                      │  └─────────┬──────────┘  │
└─────────────────────────┘                      └────────────┼─────────────┘
                                                                │
                                                       ┌────────▼────────┐
                                                       │   MongoDB Atlas  │
                                                       │  (Cloud NoSQL DB)│
                                                       └──────────────────┘
```

**Backend layering (separation of concerns):**

```
Request → Routes → Middleware (protect) → Controller → Mongoose Model → MongoDB
```

- **Routes** — define the URL + HTTP method, decide which requests need authentication
- **Middleware (`protect`)** — verifies the JWT before the request is allowed to reach the controller
- **Controllers** — contain the actual business logic (validation, ownership checks, DB calls)
- **Models** — Mongoose schemas that define and validate the shape of data in MongoDB

This layered structure means routes never talk to the database directly, and authentication logic is written once and reused across every protected route.

---

## 🔄 Application Flow

### 1. Authentication Flow
```
User submits Register form
        │
        ▼
POST /api/auth/register  →  password hashed with bcrypt  →  user saved in MongoDB
        │
        ▼
User submits Login form
        │
        ▼
POST /api/auth/login  →  bcrypt.compare(password)  →  if valid:
        │
        ▼
  JWT generated (jwt.sign with id + name, expires in 1 day)
        │
        ▼
Token + user object returned to frontend
        │
        ▼
AuthContext stores token & user in localStorage + React state
        │
        ▼
Token is attached as "Authorization: Bearer <token>" on every
subsequent protected request
```

### 2. Protected Action Flow (e.g., Creating a Post)
```
User clicks "Create Post" (frontend)
        │
        ▼
<ProtectedRoute> checks: is there a token in AuthContext?
        │
   No ──┴── Yes
   │         │
   ▼         ▼
Redirect   Render CreatePost page
to /login        │
                 ▼
        Form submitted → POST /api/posts with JWT in header
                 │
                 ▼
        protect middleware verifies JWT
                 │
           Invalid ──┴── Valid
           │              │
           ▼              ▼
        401 response   req.user = decoded token payload
                            │
                            ▼
                   postController.createPost()
                   creates Post with author = req.user.id
                            │
                            ▼
                    Saved to MongoDB → returned to client
```

### 3. Ownership / Authorization Flow (Edit, Delete Post or Comment)
```
PUT/DELETE request reaches controller (already passed protect middleware)
        │
        ▼
Controller fetches the Post/Comment by ID from MongoDB
        │
        ▼
Compares document.author (stored ObjectId) with req.user.id (from JWT)
        │
   Match? ──No──▶ 403 Forbidden "Not authorized"
        │
       Yes
        │
        ▼
  Operation proceeds (update / delete)
```

This is the most important security detail to mention in an interview: **authorization is enforced on the server**, inside the controller, by comparing the resource owner's ID against the logged-in user's ID extracted from the verified JWT — not just by hiding buttons in the UI. The frontend also hides Edit/Delete buttons for non-owners (`isOwner` check in `PostDetails.jsx`) purely for UX, but that is a convenience layer, not the actual security boundary.

---

## 👥 Roles & Permissions

This application does not use a role field (like `admin`/`user`) in the database — instead, it uses **resource ownership** as the authorization model. Every logged-in user has the same capabilities, but actions are scoped to what they own.

| Action | Guest (no token) | Logged-in User | Post/Comment Owner |
|---|---|---|---|
| View all posts | ✅ | ✅ | ✅ |
| View single post | ✅ | ✅ | ✅ |
| View comments on a post | ✅ | ✅ | ✅ |
| View any user's public profile | ❌ (route is protected) | ✅ | ✅ |
| Register / Login | ✅ | — | — |
| Create a post | ❌ | ✅ | ✅ |
| Like / unlike a post | ❌ | ✅ | ✅ |
| Add a comment | ❌ | ✅ | ✅ |
| Edit a post | ❌ | ❌ (if not owner) | ✅ |
| Delete a post | ❌ | ❌ (if not owner) | ✅ |
| Delete a comment | ❌ | ❌ (if not owner) | ✅ |
| Edit own profile (bio/interests/pic) | ❌ | ✅ (own profile only) | ✅ |

> Note: `GET /api/users/:id` is wrapped in the `protect` middleware in this implementation, so viewing a profile currently requires being logged in, even though the data returned is not sensitive.

---

## Tech Stack

**Frontend**
- React 19 — component-based UI
- Vite — dev server and build tool
- React Router DOM v7 — client-side routing (`BrowserRouter`, `Routes`, protected routes)
- Axios — HTTP client, configured with a base URL pointing to the deployed API
- Context API (`AuthContext`) — global auth state (token + user), backed by `localStorage`
- Tailwind CSS — utility-first styling
- Deployed on **Vercel** (with SPA rewrite rule in `vercel.json` so client-side routes resolve correctly on refresh)

**Backend**
- Node.js + Express 5 — REST API server
- MongoDB + Mongoose — NoSQL database and schema modeling (`User`, `Post`, `Comment`)
- jsonwebtoken (JWT) — stateless authentication, 1-day token expiry
- bcrypt — one-way password hashing before storage
- CORS — controlled cross-origin access between Vercel frontend and Render backend
- dotenv — environment variable management (`MONGO_URI`, `JWT_SECRET`, `PORT`)
- Deployed on **Render**

**Database**
- MongoDB Atlas (cloud-hosted MongoDB)

**Architecture pattern**
- MVC-inspired: Routes → Middleware → Controllers → Models
- RESTful API design (resource-based URLs, standard HTTP verbs and status codes)
- Stateless authentication via JWT (no server-side sessions)

---

## 📂 Folder Structure

```
Blog-Platform/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── api/axios.js        # Axios instance with deployed backend base URL
│   │   ├── components/         # Navbar, Footer, PostCard, CommentSection, ProtectedRoute
│   │   ├── context/AuthContext.jsx   # Global auth state (token, user, login, logout)
│   │   ├── pages/               # Home, Login, Register, CreatePost, EditPost,
│   │   │                        # MyPosts, PostDetails, Profile
│   │   └── App.jsx              # Route definitions
│   └── vercel.json              # SPA rewrite config for Vercel
│
└── server/                     # Express backend
    ├── config/db.js             # MongoDB connection (Mongoose)
    ├── models/                  # User.js, Post.js, Comment.js (Mongoose schemas)
    ├── middleware/authMiddleware.js   # JWT verification ("protect")
    ├── controllers/             # authController, postController,
    │                            # commentController, userController
    ├── routes/                  # authRoutes, postRoutes, commentRoutes, userRoutes
    └── index.js                 # Express app entry point
```

---

## 🔌 API Reference

**Base URL:** `https://blog-platform-ixju.onrender.com/api`

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register a new user (hashes password, saves user) |
| POST | `/auth/login` | No | Authenticate user, returns JWT + user object |
| GET | `/posts` | No | Get all posts (with author and likes populated) |
| GET | `/posts/my-posts` | Yes | Get posts created by the logged-in user |
| GET | `/posts/:id` | No | Get a single post by ID |
| POST | `/posts` | Yes | Create a new post |
| PUT | `/posts/:id` | Yes (owner only) | Update a post |
| DELETE | `/posts/:id` | Yes (owner only) | Delete a post |
| POST | `/posts/:id/like` | Yes | Toggle like/unlike on a post |
| GET | `/comments/post/:postId` | No | Get all comments for a post |
| POST | `/comments/post/:postId` | Yes | Add a comment to a post |
| DELETE | `/comments/:commentId` | Yes (owner only) | Delete a comment |
| GET | `/users/profile` | Yes | Get logged-in user's own profile + post count |
| PUT | `/users/profile` | Yes | Update bio, interests, profile picture |
| GET | `/users/:id` | Yes | Get any user's public profile + post count |

---

## ⚙️ Running Locally

**1. Clone the repository**
```bash
git clone https://github.com/Bhuvaneshwari-bhu/Blog-Platform.git
cd Blog-Platform
```

**2. Backend setup**
```bash
cd server
npm install
```
Create a `.env` file in `/server`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
```bash
npm run dev
```

**3. Frontend setup**
```bash
cd client
npm install
```
In `client/src/api/axios.js`, point `baseURL` to `http://localhost:5000/api` for local development (it currently points to the deployed Render URL).
```bash
npm run dev
```

---

## 💡 Resume Bullet Points

> Pick 2–4 depending on the role/length you need. All are written to be ATS-friendly and quantifiable where possible.

- Designed and developed a full-stack blogging platform (React, Node.js, Express, MongoDB) with JWT-based authentication and bcrypt password hashing, deployed live on Vercel and Render.
- Implemented a RESTful API with 14+ endpoints across authentication, posts, comments, and user profiles, using a layered Routes → Middleware → Controller → Model architecture.
- Enforced ownership-based authorization on the backend so users can only edit or delete their own posts and comments, preventing unauthorized access at the API level (not just hidden UI).
- Built a responsive React frontend with React Router v7 and protected routes, using Context API to manage authentication state across the app.
- Designed MongoDB schemas (Mongoose) for Users, Posts, and Comments with relational references (`ObjectId` population) to efficiently join author and like data into post responses.
- Implemented a like/unlike toggle system and a nested comment system, each scoped per-post and per-user.
- Independently deployed a decoupled frontend (Vercel) and backend (Render) connected via CORS-secured REST APIs and environment-based configuration.

---

## 🎤 Interview Explanation Guide

This section is written so you can read it once before an interview and confidently explain *how* and *why* the project works the way it does.

### "Walk me through your project."
"It's a full-stack blogging platform built with the MERN stack — MongoDB, Express, React, and Node. Users can register, log in, write blog posts, like other people's posts, and comment on them. I built it with a clear separation between the frontend, which is a React single-page app deployed on Vercel, and the backend, which is a REST API built with Express, deployed on Render, and backed by MongoDB Atlas. They only talk to each other over HTTPS using JSON — there's no shared code between them."

### "How does authentication work?"
"When a user registers, I hash their password with bcrypt before storing it — so even if the database were compromised, raw passwords are never exposed. On login, I compare the submitted password against the stored hash using `bcrypt.compare`. If it matches, I generate a JWT using `jsonwebtoken`, signed with a secret key stored in an environment variable, containing the user's ID and name, and set to expire in 1 day. That token is sent back to the frontend and stored — token and user info both go into `localStorage` and into a React Context (`AuthContext`) so the rest of the app can access auth state without prop drilling. From then on, every request that needs authentication attaches that token as a Bearer token in the Authorization header."

### "How do you protect routes on the backend?"
"I wrote a middleware function called `protect`. It pulls the Authorization header, extracts the token, and verifies it using `jwt.verify()` with the same secret used to sign it. If verification succeeds, it decodes the payload and attaches it to `req.user`, then calls `next()` so the request continues to the controller. If there's no token, or it's invalid or expired, it immediately returns a 401 response. Any route that needs a logged-in user — like creating a post — just adds `protect` as middleware before the controller function, so I don't repeat that logic anywhere."

### "How do you make sure users can only edit their own posts?"
"This is the part I'd highlight most, because it's a common security mistake to only hide an Edit/Delete button in the UI and assume that's enough. In my backend, when a PUT or DELETE request comes in for a post, the controller first fetches that post from MongoDB, then explicitly compares `post.author.toString()` — the ID stored on the post — against `req.user.id`, which comes from the verified JWT, not from anything the client sent in the request body. If they don't match, it returns a 403 Forbidden before any update happens. So even if someone manually crafted a request with Postman using someone else's post ID, they still couldn't modify it without owning it. The frontend does the same check (`isOwner`) just to hide buttons for a clean UX, but that's not the actual security boundary — the API is."

### "Why MongoDB instead of a SQL database?"
"The data here — posts, comments, users — has a fairly simple, document-friendly shape, and I'm using Mongoose to define schemas with validation (required fields, unique email, etc.), so I still get structure even though MongoDB is schema-less by default. I also use Mongoose's `populate()` method to do reference-based joins — for example, when fetching all posts, I populate the `author` field with the user's name and email, and populate `likes` with the names of users who liked it, instead of returning raw ObjectIds."

### "How does the like system work?"
"Each Post document has a `likes` array of User ObjectIds. When a user hits the like endpoint, the backend checks whether their user ID is already in that array. If it is, it removes it (unlike); if it isn't, it pushes it (like). This is a toggle, so one endpoint, `POST /posts/:id/like`, handles both actions, and I return the updated like count and a boolean so the frontend can update the UI immediately."

### "How does the frontend manage authentication state?"
"I used React's Context API rather than something like Redux, since the auth state here is simple — just a token and a user object. `AuthProvider` wraps the whole app, initializes state from `localStorage` so a refresh doesn't log the user out, and exposes `login()` and `logout()` functions that update both `localStorage` and React state together. Any component can call `useAuth()` to read the current token/user or trigger login/logout."

### "How do protected routes work on the frontend?"
"I wrote a `ProtectedRoute` wrapper component that checks if there's a token in `AuthContext`. If there isn't, it uses React Router's `Navigate` to redirect to `/login`. If there is, it renders whatever child component was passed in. Routes like Create Post, Edit Post, and My Posts are wrapped in this component in `App.jsx`."

### "What would you improve if you had more time?"
Good honest answers that show maturity rather than overselling the project:
- Move the JWT out of `localStorage` into an httpOnly cookie to reduce XSS token-theft risk.
- Add refresh tokens so sessions don't hard-expire after 1 day.
- Add pagination on `GET /posts` instead of returning every post at once.
- Add server-side input validation (e.g., with `express-validator` or `zod`) instead of relying only on Mongoose schema validation.
- Make `GET /users/:id` public (currently requires auth even though it returns non-sensitive data).
- Add image upload support for post content (currently text-only) and proper profile picture upload instead of a URL string.
- Add rate limiting on `/auth/login` to slow down brute-force attempts.

### "What was the trickiest bug or design decision?"
Use this as a template and fill in with your real experience — interviewers can tell when this is rehearsed vs. genuine, so be ready with a specific example from when you actually built this (e.g., handling the `req.user.id` vs `req.user._id` mismatch between what's encoded in the JWT and what Mongoose returns, or getting the Vercel SPA rewrite right so refreshing on a non-root route didn't 404, or CORS configuration between Render and Vercel domains).

---

## 📄 License

This project is open for educational and portfolio purposes.
