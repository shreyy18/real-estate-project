# Real Estate Website & Admin Panel

This is a full-stack real estate webpage replica with a functional Admin Panel to manage content dynamically.

## Tech Stack
- Frontend: React.js (Vite) + Vanilla CSS
- Backend: Node.js (Express)
- Database: SQLite
- Authentication: Simple credential-based login

## Setup Instructions

1. Install dependencies from the root directory:
\`\`\`bash
npm run install-all
\`\`\`
*(Or manually run `npm install` inside the `backend` and `frontend` folders)*

2. Start the development server (runs both frontend and backend):
\`\`\`bash
npm run dev
\`\`\`

3. The backend runs on `http://localhost:3000` and the SQLite database (`database.sqlite`) is auto-generated inside the `backend` folder with seed data.
4. The frontend runs on `http://localhost:5173` (or any available Vite port).

## Admin Features
- Navigate to `/admin` using the link in the footer or directly via URL.
- **Login Credentials:**
  - **Email:** admin@gmail.com
  - **Password:** 1234
- **Admin Dashboard:** Allows you to edit text content for Hero, About, Amenities, FAQ, and updates live on the main landing page.
