<p align="center">
  <img src="https://img.shields.io/badge/Wayfare%20OS-Travel%20Operating%20System-0ea5e9?style=for-the-badge&logo=airplayvideo&logoColor=white" alt="Wayfare OS" />
</p>

# 🌍 Wayfare OS — Travel Planning & Itinerary Operating System

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql)](https://neon.tech/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

**Wayfare OS** is a full-stack personal academic travel planning and itinerary management platform that empowers travelers to plan personalized multi-day trips, build day-by-day itineraries with drag-and-drop, explore 40+ famous world destinations, track budgets & expenses, visualize trips on interactive maps, and share travel plans with a global community.

> 🎓 **Academic Engineering Project** — Full-Stack Travel Platform

---

## 📸 Key Screens

| Dashboard | Explore Destinations | Trip Details & Itinerary |
|:---------:|:--------------------:|:------------------------:|
| Hero search banner, trip cards, stats | 40 world cities with filters & modals | Day-by-day timeline with budget tracking |

---

## ✨ Features

### 🏠 Dashboard (`/`)
- **Hero Banner** with quick trip search form (destination, duration, travel style)
- **Trip Overview Cards** showing all user trips with status badges (Draft, Upcoming, Ongoing, Completed)
- **Search, Filter, Sort & Group By** controls for trip management
- **Quick Stats** — total trips, countries visited, upcoming trips count
- **Popular Regions** showcase (Europe, Asia, Americas, Africa, Oceania)

### 🔍 Explore Destinations (`/explore`)
- **40 Famous World Cities** with curated data — Kyoto, Paris, Tokyo, Rome, Bali, Santorini, Dubai, Singapore, Istanbul, Seoul, Machu Picchu, Maldives, and 28 more
- Each city includes: popularity score, cost level (Budget/Moderate/High/Luxury), recommended days, cover photo, rich description, and 4 detailed activities
- **Destination Detail Modal** — stats badges, full description, top activities list with ratings/duration/cost
- **Activities Tab** — browse & search all activities across destinations
- **1-Click "Plan a Trip"** button from any destination modal
- **Save to Wishlist** with heart icon on each card

### ✈️ Trip Management (`/my-trips`, `/trips/new`)
- **Create New Trip** — name, starting location, dates, budget, traveler count, cover image, visibility (Private/Shared/Public)
- **My Trips** — grid/list view of all trips with search, status filtering, and quick actions
- **Trip Duplication** — clone any trip for reuse
- **Delete & Edit** operations on existing trips

### 📋 Itinerary Builder (`/trips/:id/itinerary`)
- **Drag-and-Drop** day-by-day itinerary planning powered by `@hello-pangea/dnd`
- **Trip Stops** — add multi-city stops with arrival/departure dates and ordering
- **Scheduled Activities** — assign activities to specific days with time slots, duration, and cost
- **Accommodations** — hotel/hostel/Airbnb/resort entries with check-in/out dates and cost
- **Transport Segments** — flight/train/bus/taxi/ferry between stops with departure/arrival times
- **Interactive Map** — Leaflet-powered map with markers for each stop and polyline route visualization

### 📊 Trip Details (`/trips/:id`)
- **Itinerary Timeline View** — Day 1, Day 2, etc. with Physical Activity cards and Expense cards
- **Budget Section** — expense tracking with category breakdowns (Transport, Accommodation, Activity, Meal, Miscellaneous)
- **Control Bar** — search, group by, filter, sort dropdowns
- **Visual Timeline** with glowing connectors between day activities

### 📅 Trip Calendar (`/calendar`)
- **Full Month Grid** with dynamic year/month navigation
- **Trip date ranges** automatically mapped onto calendar days with color-coded indicators
- **Trip Schedule List** alternate view mode

### 👥 Community Feed (`/community`)
- **Public Trip Feed** — browse trips shared by other travelers
- **Like & Unlike** trips with real-time like counts
- **Copy Trip** — duplicate a public trip into your own account
- **Creator Attribution** — shows trip creator name and avatar

### ❤️ Saved Wishlist (`/saved`)
- **Saved Destinations** — bookmark favorite places from the Explore page
- Quick access to saved items with 1-click trip planning

### 👤 User Profile (`/profile`)
- **Personal Details** — first name, last name, email, phone, city, country, bio
- **Travel Interests** — tag-based preferences (Adventure, Culture, Food, etc.)
- **Profile Photo** upload
- **Change Password** and **Delete Account** options

### 🔐 Authentication
- **Register** with email, password, personal details, and travel interests
- **Login** with JWT-based authentication
- **Protected Routes** — automatic redirect to login for unauthenticated users
- **Auto Session Restore** — persisted JWT token in localStorage

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|:-----------|:--------|
| **React 19** | UI component framework |
| **Vite 8** | Lightning-fast dev server & build tool |
| **React Router DOM 7** | Client-side routing with protected/public route guards |
| **Axios** | HTTP client with JWT interceptors |
| **Leaflet + React-Leaflet** | Interactive maps with markers & polyline routes |
| **@hello-pangea/dnd** | Drag-and-drop itinerary reordering |
| **date-fns** | Date formatting & manipulation |
| **React Hot Toast** | Toast notifications |
| **React Icons (Feather)** | Icon library |
| **Vanilla CSS** | Custom design system with CSS variables/tokens |

### Backend
| Technology | Purpose |
|:-----------|:--------|
| **Node.js** | JavaScript runtime |
| **Express 5** | Web framework with RESTful API |
| **PostgreSQL (Neon)** | Cloud-hosted relational database |
| **pg** | PostgreSQL client for Node.js |
| **JSON Web Tokens (JWT)** | Stateless authentication |
| **bcryptjs** | Password hashing |
| **express-validator** | Request validation middleware |
| **multer** | File upload handling |
| **CORS** | Cross-origin request security |
| **dotenv** | Environment variable management |

---

## 📁 Project Structure

```
wayfare-os/
├── backend/
│   ├── database/
│   │   ├── schema.sql              # Full PostgreSQL schema (14 tables)
│   │   ├── seed.sql                # Sample seed data
│   │   └── run_seed.js             # Seed runner script
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js               # PostgreSQL pool + auto table creation
│   │   │   └── env.js              # Environment config loader
│   │   ├── controllers/
│   │   │   ├── auth.controller.js          # Register, Login, Profile CRUD
│   │   │   ├── trip.controller.js          # Trip CRUD, duplicate, share
│   │   │   ├── trip_stop.controller.js     # Multi-city stop management
│   │   │   ├── itinerary.controller.js     # Activities, accommodation, transport
│   │   │   ├── destinations.controller.js  # Destination search & details
│   │   │   ├── activities.controller.js    # Activity search
│   │   │   ├── expenses.controller.js      # Budget & expense tracking
│   │   │   └── community.controller.js     # Public feed, likes, copy trip
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification middleware
│   │   │   └── errorHandler.js      # Global error handler
│   │   ├── models/
│   │   │   └── user.model.js        # User database model
│   │   ├── routes/
│   │   │   ├── auth.routes.js       # /api/auth/*
│   │   │   ├── trip.routes.js       # /api/trips/*
│   │   │   ├── itinerary.routes.js  # /api/stops/*
│   │   │   ├── destinations.routes.js  # /api/destinations/*
│   │   │   ├── activities.routes.js # /api/activities/*
│   │   │   └── community.routes.js  # /api/community/*
│   │   ├── utils/
│   │   │   ├── hash.js              # Bcrypt helpers
│   │   │   └── token.js             # JWT helpers
│   │   └── app.js                   # Express app setup
│   ├── server.js                    # Server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── images/                  # Static destination & trip cover images
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── LoadingScreen.jsx
│   │   │   └── layout/
│   │   │       ├── AppLayout.jsx    # Main app shell (Sidebar + Outlet)
│   │   │       ├── Sidebar.jsx      # Fixed left sidebar navigation
│   │   │       ├── Header.jsx       # Top header with search & user menu
│   │   │       └── BottomNav.jsx    # Mobile bottom navigation
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx      # React Context for auth state
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx        # Login form
│   │   │   │   ├── Register.jsx     # Multi-step registration
│   │   │   │   └── Profile.jsx      # User profile management
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.jsx    # Home dashboard with stats & trips
│   │   │   ├── discovery/
│   │   │   │   ├── Explore.jsx      # 40 destinations + search + modals
│   │   │   │   ├── Community.jsx    # Public trip feed
│   │   │   │   └── Saved.jsx        # Saved wishlist
│   │   │   ├── trips/
│   │   │   │   ├── MyTrips.jsx      # Trip list with filters
│   │   │   │   ├── CreateTrip.jsx   # New trip creation form
│   │   │   │   ├── TripDetails.jsx  # Trip detail view + itinerary timeline
│   │   │   │   ├── ItineraryBuilder.jsx  # Drag-and-drop itinerary editor
│   │   │   │   └── TripCalendar.jsx # Calendar grid view
│   │   │   └── errors/
│   │   │       └── NotFound.jsx     # 404 page
│   │   ├── services/
│   │   │   └── api.js               # Axios instance + all API modules
│   │   ├── styles/
│   │   │   └── components.css       # Reusable component styles
│   │   ├── index.css                # Design system tokens & global styles
│   │   ├── App.jsx                  # Route configuration
│   │   └── main.jsx                 # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 🗃️ Database Schema

The PostgreSQL database consists of **14 tables** with custom ENUM types:

| Table | Description |
|:------|:------------|
| `users` | User accounts with profile info, preferences, role |
| `travel_interests` | User travel preference tags (many-to-many) |
| `destinations` | City directory with country, region, cost level, coordinates |
| `activities` | Things to do at each destination with ratings & cost |
| `trips` | User trips with dates, budget, status, visibility |
| `trip_stops` | Multi-city stops within a trip with ordering |
| `scheduled_activities` | Activities assigned to specific days/times within stops |
| `accommodations` | Hotel/hostel/Airbnb entries per stop |
| `transports` | Flight/train/bus segments between stops |
| `expenses` | Budget tracking with categorized expenses |
| `saved_destinations` | User bookmarked/wishlisted destinations |
| `community_itineraries` | Public trip sharing metadata |
| `trip_collaborators` | Shared trip access permissions (view/edit) |
| `public_share_links` | Shareable link tokens for trips |
| `likes` | Community trip likes (auto-created) |

---

## 🔗 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| `POST` | `/api/auth/register` | ❌ | Register new user account |
| `POST` | `/api/auth/login` | ❌ | Login & receive JWT token |
| `GET` | `/api/auth/me` | ✅ | Get authenticated user profile |
| `PUT` | `/api/auth/me` | ✅ | Update user profile |
| `PUT` | `/api/auth/me/password` | ✅ | Change password |
| `DELETE` | `/api/auth/me` | ✅ | Delete user account |

### Trips (`/api/trips`)
| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| `GET` | `/api/trips` | ✅ | List all user trips |
| `POST` | `/api/trips` | ✅ | Create a new trip |
| `GET` | `/api/trips/:id` | ✅ | Get trip details |
| `PUT` | `/api/trips/:id` | ✅ | Update trip |
| `DELETE` | `/api/trips/:id` | ✅ | Delete trip |
| `POST` | `/api/trips/:id/duplicate` | ✅ | Duplicate a trip |
| `POST` | `/api/trips/:id/share` | ✅ | Generate share link |
| `GET` | `/api/trips/:id/budget` | ✅ | Get budget breakdown |
| `GET` | `/api/trips/:id/stops` | ✅ | List stops in a trip |
| `POST` | `/api/trips/:id/stops` | ✅ | Add a stop to trip |
| `PUT` | `/api/trips/:id/stops/:stopId` | ✅ | Update a stop |
| `DELETE` | `/api/trips/:id/stops/:stopId` | ✅ | Remove a stop |
| `PUT` | `/api/trips/:id/stops/reorder` | ✅ | Reorder stops |
| `POST` | `/api/trips/:id/expenses` | ✅ | Add expense |
| `PUT` | `/api/trips/:id/expenses/:expId` | ✅ | Update expense |
| `DELETE` | `/api/trips/:id/expenses/:expId` | ✅ | Delete expense |

### Itinerary (`/api/stops`)
| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| `GET` | `/api/stops/:stopId/activities` | ✅ | List scheduled activities |
| `POST` | `/api/stops/:stopId/activities` | ✅ | Add activity to day |
| `PUT` | `/api/stops/:stopId/activities/:id` | ✅ | Update activity |
| `DELETE` | `/api/stops/:stopId/activities/:id` | ✅ | Remove activity |
| `POST` | `/api/stops/:stopId/accommodation` | ✅ | Add accommodation |
| `POST` | `/api/stops/:stopId/transport` | ✅ | Add transport segment |

### Destinations & Activities (`/api/destinations`, `/api/activities`)
| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| `GET` | `/api/destinations` | ✅ | Search destinations |
| `GET` | `/api/destinations/:id` | ✅ | Get destination details |
| `GET` | `/api/destinations/:id/activities` | ✅ | Get destination activities |
| `GET` | `/api/activities` | ✅ | Search activities |

### Community (`/api/community`)
| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| `GET` | `/api/community` | ✅ | Browse public trips feed |
| `POST` | `/api/community/:tripId/like` | ✅ | Like/unlike a trip |
| `POST` | `/api/community/:tripId/copy` | ✅ | Copy a public trip |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** (comes with Node.js)
- **PostgreSQL** database (we recommend [Neon](https://neon.tech/) for free serverless PostgreSQL)

### 1. Clone the Repository
```bash
git clone https://github.com/Jainish6775/wayfare-os.git
cd wayfare-os
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file from the example:
```bash
cp .env.example .env
```

Configure your `.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Initialize the database (run the schema on your PostgreSQL):
```bash
# Connect to your database and execute:
psql $DATABASE_URL -f database/schema.sql
psql $DATABASE_URL -f database/seed.sql
```

Start the backend server:
```bash
npm run dev
```
> ✅ Backend runs on `http://localhost:5000`

### 3. Setup Frontend
Open a new terminal:
```bash
cd frontend
npm install
```

Create a `.env` file:
```bash
cp .env.example .env
```

Configure your `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend dev server:
```bash
npm run dev
```
> ✅ Frontend runs on `http://localhost:5173`

### 4. Open in Browser
Navigate to `http://localhost:5173` → Register a new account → Start planning your trips! 🎉

---

## 🧪 Health Check

Verify the backend is running:
```bash
curl http://localhost:5000/api/health
# → { "status": "ok", "timestamp": "..." }
```

---

## 👨‍💻 Developer & Author

Built with ❤️ by **Jainish Talpara** — [GitHub](https://github.com/Jainish6775)
*Academic Capstone / Full-Stack Software Engineering Project*

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).