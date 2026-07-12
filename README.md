# L’Étoile Dorée - Premium Restaurant Website & Admin Dashboard

A premium, fully dynamic restaurant website with a secure Admin Dashboard. Built with React (Vite, TS, Tailwind CSS v4, Framer Motion) for the frontend, Node.js & Express for the backend, and MongoDB for database persistence. Image uploads are managed via Cloudinary with a local storage fallback.

## Key Features
- **Luxury Aesthetic**: Sleek dark-mode theme featuring gold accents, smooth hover micro-animations, and entry animations.
- **Dynamic Content**: Every heading, text, button link, badge, about detail, chef listing, and offer banner is loaded dynamically from MongoDB.
- **Real-Time Live Preview**: The Admin Dashboard features a side-by-side device simulator. Editing values in dashboard forms instantly previews modifications on the landing page layout without needing a page refresh or database write.
- **Visual Theme customizer**: Update branding colors, select Google Fonts, adjust button curvature, and modify border-radius sliders visually in the dashboard.
- **Media Library**: Supports drag-and-drop multiple image uploads, thumbnail listings, optimization size warnings, and item deletions.
- **Table Reservation System**: Inline calendar reservation form that logs entries to MongoDB, visible on the dashboard home screen.
- **Submissions**: Contact form logging, newsletter subscriber lists, and copyable discount coupons.
- **Freelancer Template duplication**: Easy to duplicate for a new client. To clone the website for a new restaurant, simply duplicate the database or change settings inside the dashboard forms — no code edits are required!

---

## Project Structure
```
landing page/
├── client/                 # React Frontend (Vite + TypeScript + Tailwind v4)
│   ├── src/
│   │   ├── components/     # UI layouts & helpers
│   │   ├── context/        # AppContext (JWT auth, global state, live preview styles)
│   │   ├── dashboard/      # Admin panels & forms
│   │   │   └── views/      # CRUD panels (Home, Settings, Menu, Gallery, Theme, etc.)
│   │   ├── landing/        # Public sections (Hero, About, Menu, Forms)
│   │   └── services/       # Fetch-based API client
├── server/                 # Node.js + Express Backend
│   ├── config/             # DB & Cloudinary configuration
│   ├── middleware/         # Token authorization
│   ├── models/             # Mongoose schemas
│   ├── routes/             # REST endpoints
│   └── scripts/            # DB seed script
```

---

## Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas connection string)
- **Cloudinary account** (Optional: local file storage acts as a fallback if omitted)

### 1. Database & Environment Configuration

#### Backend setup:
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Make a copy of the environment template:
   ```bash
   copy .env.example .env
   ```
3. Open `.env` and fill in your variables:
   - `PORT`: Server port (default: 5000)
   - `MONGODB_URI`: MongoDB connection link (e.g. `mongodb://localhost:27017/premium-restaurant` or Atlas URL)
   - `JWT_SECRET`: Any long secure random string for authenticating sessions.
   - **Cloudinary Keys (Optional)**: If you leave `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` blank, the app will automatically fall back to storing uploads locally in the `./server/uploads/` directory and serving them statically!

### 2. Populate Seed Data
We have created an automated database seeder containing luxury Gold theme settings, French-modern dishes, chefs, reviews, and a default admin profile. 

Run the seed script from the server folder:
```bash
npm run seed
```
> **Default Admin Credentials:**
> - **Email:** `admin@restaurant.com`
> - **Password:** `admin123`

---

## Running the Application Locally

You will run the backend server and frontend client concurrently:

### Run Backend Server:
From the `server/` directory:
```bash
npm run dev
```
The server will run on `http://localhost:5000`. You can check server health at `http://localhost:5000/health`.

### Run Frontend Client:
From the `client/` directory:
1. Install client dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
The client will run on `http://localhost:5173`. Open this URL in your browser to view the dynamic landing page! 
To configure content, navigate to `http://localhost:5173/admin/login` and enter the default admin credentials.
