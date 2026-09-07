# Go Thailand - User & Auth Web Service (Express.js)

Standalone Identity & Profile Microservice for Go Thailand platform.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env
# Edit .env and enter your MONGODB_URI and JWT_SECRET

# 3. Start development server
npm run dev
# Server will run on http://localhost:5001
```

---

## 📡 API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | Service health check |
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token |
| `GET` | `/api/auth/me` | Bearer Token | Get current authenticated user profile |
| `GET` | `/api/auth/users/:id` | Public/Service | Fetch user summary by ID (for inter-service calls) |

---

## ☁️ Deployment on Render

1. **Root Directory**: `landing/user-service`
2. **Build Command**: `npm install`
3. **Start Command**: `node server.js`
4. **Environment Variables**:
   * `MONGODB_URI`: `<Atlas Connection String>`
   * `JWT_SECRET`: `gt_super_secret_jwt_key_2026`
   * `CLIENT_URL`: `*`
   * `NODE_ENV`: `production`
