# Intershalla CRM

This repository contains two parts:
- **Server**: Express.js API for user auth, agent management, and list distribution.
- **Client**: React + Vite + TypeScript frontend.

## Prerequisites

- Node.js ≥ 18.x and npm/Yarn
- MongoDB (local) or MongoDB Atlas account
- Optional: Vercel account for deployment

## Environment Variables

Create a `.env` in `server/`:

```properties
MONGODB_URI=<your MongoDB connection string>
PORT=5000
JWT_SECRET=<your_jwt_secret>
```

## Server Setup

```bash
cd "g:/all major project/New folder/intershalla/server"
npm install
# development
npm run dev
# production
npm start
```

- Dev server runs at `http://localhost:5000`
- API routes are prefixed with `/api`

## Client Setup

```bash
cd "g:/all major project/New folder/intershalla/vite-project"
npm install
npm run dev
```

- Frontend runs at `http://localhost:5173`

## Build

### Client
```bash
npm run build
```
Outputs static files to `vite-project/dist/`

### Server
No build step. Make sure `.env` is present before `npm start`.

## Deployment

### Vercel (Serverless)

1. In Vercel dashboard, import `server/` folder.
2. Set environment variables under Settings.
3. Deploy.

### Static Frontend

1. Deploy `vite-project/dist/` to any static host (e.g. Vercel, Netlify, Surge).

## Usage

1. Register a new admin via `POST /api/auth/register`.
2. Log in via `POST /api/auth/login`, save the JWT.
3. Use `x-auth-token: <JWT>` header for all private routes.
4. Manage agents (`/api/agents`) and upload lists (`/api/lists/upload`) from the UI.

## Folder Structure

```
intershalla/
├── server/         # Express API
├── vite-project/   # React frontend
└── README.md
```

## Troubleshooting

- **MongoDB Connection Error**: Check URI and whitelist IP in Atlas.
- **CORS Issues**: Update `cors()` origin in `server.js` to match frontend URL.
- **File Upload Errors**: Ensure request is `multipart/form-data` with field name `file`.