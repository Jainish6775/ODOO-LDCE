# 🌍 GlobeTrotter — Next-Gen Luxury Travel & Itinerary Planning Platform

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**GlobeTrotter** is an all-in-one luxury travel planning and itinerary management platform. Built with modern web architecture and high-performance design aesthetics, GlobeTrotter empowers travelers to plan detailed day-by-day trips, visualize interactive map routes, convert currencies on the fly, export PDF itineraries, track travel budgets, and share travel stories with a vibrant global community.

---

## ✨ Key Features

### 🗺️ 1. Interactive Route & Map Visualizer
- Powered by `React-Leaflet` and Leaflet maps.
- Real-time map markers for every itinerary stop with polylines mapping out route directions between cities and attractions.

### 📅 2. Dynamic Multi-Month Trip Calendar
- Full month & year dynamic grid calendar view (`/calendar`).
- Map trip date ranges automatically onto calendar days.
- Filter between **Month Grid** and **Trip Schedule List** view modes.

### 💱 3. Multi-Currency Conversion & Budget Tracking
- Live currency recalculation across **USD ($)**, **EUR (€)**, **GBP (£)**, and **INR (₹)**.
- Budget progress bars tracking estimated vs. actual expenses with visual status indicators.

### 📄 4. PDF Itinerary Export & 1-Click Sharing
- Browser print & PDF generator formatting clean printable itineraries.
- One-click copy-to-clipboard share link modal for collaborating with family and co-travelers.

### ☀️ 5. Live Destination Weather & Packing Checklist
- Live weather forecast widgets for top travel destinations (Kyoto, Paris, Goa).
- Interactive smart travel essentials packing checklist with real-time item toggles.

### 📸 6. Global Travel Community & Wishlist
- Share trip stories, photos, and tips on the **Community Feed** (`/community`).
- Save favorite destinations to your personal **Saved Wishlist** (`/saved`) and add items directly to active trips with 1 click.

### 👤 7. User Profile & Fixed Sidebar Navigation
- Locked fixed sidebar navigation (`position: fixed`) for seamless multi-page browsing.
- Custom user profile modal (`/profile`) supporting personal details, travel preferences, and custom avatar photos.

---

## 🛠️ Technology Stack

### **Frontend Architecture**
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM (v6)
- **State & Auth**: React Context API (`AuthContext`)
- **Mapping Engine**: `Leaflet` & `React-Leaflet`
- **Icons & Alerts**: `React-Icons` (Feather & Hi2 icons), `React-Hot-Toast`
- **Styling**: Vanilla CSS Design System with CSS Tokens, Google Fonts (`Outfit`, `Space Grotesk`, `Plus Jakarta Sans`)

### **Backend Architecture**
- **Runtime**: Node.js & Express.js
- **Database**: PostgreSQL / MySQL schema setup (`schema.sql` & `seed.sql`)
- **Security & Auth**: JSON Web Tokens (JWT), Bcrypt password hashing, CORS protection
- **API Standard**: RESTful JSON API

---

## 🚀 Quick Start & Local Setup

Follow these instructions to run GlobeTrotter locally on your machine.

### **Prerequisites**
- Node.js (v18.0.0 or higher)
- npm or yarn

---

### **1. Clone Repository**
```bash
git clone https://github.com/Jainish6775/ODOO-LDCE.git
cd ODOO-LDCE
```

---

### **2. Setup Backend Server**
```bash
cd backend
npm install
npm run dev
```
> The backend server will start on `http://localhost:8000`.

---

### **3. Setup Frontend Client**
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
> The frontend client will launch on `http://localhost:5173` or `http://localhost:5174`.

---

## 📁 Repository Structure

```
ODOO-LDCE/
├── backend/
│   ├── database/
│   │   ├── schema.sql        # Database tables schema
│   │   └── seed.sql          # Sample data seed
│   ├── src/
│   │   ├── controllers/     # Auth & Trip controllers
│   │   ├── routes/          # API route definitions
│   │   └── app.js           # Express app entry point
│   ├── server.js            # Server launcher
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── images/          # Static assets & user photos
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/      # MapView, LoadingScreen, Modals
│   │   │   └── layout/      # Sidebar, Header, AppLayout
│   │   ├── contexts/        # AuthContext state
│   │   ├── pages/
│   │   │   ├── auth/        # Login, Register, Profile
│   │   │   ├── dashboard/   # Dashboard (Home)
│   │   │   ├── discovery/   # Explore, Community, Saved
│   │   │   └── trips/       # MyTrips, CreateTrip, ItineraryBuilder, TripCalendar, TripDetails
│   │   ├── services/        # Axios API client
│   │   ├── index.css        # Core design tokens
│   │   └── App.jsx          # Route configuration
│   └── package.json
└── README.md
```

---

## 🔐 API Reference Highlights

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated user details |
| `GET` | `/api/trips` | Fetch user's saved trips |
| `POST` | `/api/trips` | Create a new trip itinerary |
| `GET` | `/api/trips/:id` | Fetch trip details with stops |
| `POST` | `/api/trips/:id/stops` | Add a stop/activity to a trip |
| `GET` | `/api/community/stories` | Fetch community story feed |

---

## 📝 License

This project is licensed under the [MIT License](LICENSE). Built with ❤️ by **Jainish Talpara**.