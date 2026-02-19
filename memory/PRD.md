# Nameword Platform - PRD

## Original Problem Statement
User requested setup of the Nameword platform (domain/hosting management) on the Emergent pod environment with specific `.env` configuration, using the pod URL where needed.

## Architecture
- **Backend**: Node.js + Express.js on port 8001 (adapted from default Python/FastAPI supervisor config)
- **Frontend**: React + Vite 7 + Tailwind CSS v4 on port 3000
- **Database**: MongoDB (local, database: `bozzname-api`)
- **Supervisor**: Modified to run Node.js backend via `start.sh` wrapper and Vite dev server for frontend

## Tech Stack
- Backend: Express.js, Mongoose, bcrypt, JWT, nodemailer, Brevo, Twilio/Telnyx, DynoPay, Google Auth, SSH2, Cloudflare, Sentry
- Frontend: React 19, Vite 7, Tailwind CSS v4, Formik, Yup, React Router, Axios, React Toastify
- Database: MongoDB 7.0 (Mongoose ODM)

## Key Configuration Changes
1. Supervisor config: Changed backend from `uvicorn` to `bash start.sh` (Node.js)
2. Supervisor config: Changed frontend from `yarn start` to `yarn dev --host 0.0.0.0 --port 3000`
3. Backend .env: Created with all user-provided keys, using pod URL for APP_URL, FRONTEND_URL, CORS_ORIGIN, Google OAuth redirects
4. Frontend .env: Created with VITE_API_BASE_URL pointing to pod URL
5. Vite config: Added `allowedHosts: true`, proxy for `/auth/*` to backend, port 3000
6. DB_URI: Using local MongoDB (`mongodb://localhost:27017/bozzname-api`) since Railway internal DB is not accessible from this pod

## What's Been Implemented (Feb 19, 2026)
- Full environment setup with all env variables configured
- Backend running on port 8001 with all API routes functional
- Frontend running on port 3000 via Vite dev server
- MongoDB connected with seeded data (VPS Plans, RDP Plans, Badges, CPanel Plans, OS, Membership Tiers, Admins)
- Google OAuth redirect URLs configured (note: Google Cloud Console needs updating for the new redirect URLs)
- Vite proxy configured for `/auth/*` routes to reach backend

## Seeded Data
- 4 VPS Plans
- 3 RDP Plans
- 9 Badges
- 9 CPanel Plans
- 6 Operating Systems
- 4 Membership Tiers
- 1 Admin (SSH-Admin)

## Important Notes
- The Railway MongoDB (DB_URI provided by user) is not accessible from this pod. Local MongoDB is used instead. User data from Railway would need to be exported/imported if needed.
- Google OAuth won't work until the redirect URLs are updated in Google Cloud Console to use the pod URL.
- NODE_ENV is set to "production" but .env is loaded via start.sh wrapper script.

## Backlog / Next Steps
- P0: Import user data from Railway MongoDB if needed
- P0: Update Google Cloud Console OAuth redirect URLs for the pod URL
- P1: Domain search/registration functionality testing
- P1: User registration and authentication flow testing
- P2: Payment (DynoPay) integration testing
- P2: Hosting/VPS provisioning testing
