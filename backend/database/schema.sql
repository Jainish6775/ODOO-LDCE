-- ============================================
-- GlobeTrotter Database Schema (PostgreSQL / Neon)
-- ============================================

-- ============================================
-- Custom ENUM types
-- ============================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('traveler', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE cost_level_type AS ENUM ('budget', 'moderate', 'luxury');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE trip_visibility AS ENUM ('private', 'shared', 'public');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE trip_status AS ENUM ('draft', 'upcoming', 'ongoing', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE accommodation_type AS ENUM ('hotel', 'hostel', 'airbnb', 'resort', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE transport_mode AS ENUM ('flight', 'train', 'bus', 'taxi', 'car', 'ferry', 'walk', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE expense_category AS ENUM ('transport', 'accommodation', 'activity', 'meal', 'miscellaneous');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE collaborator_permission AS ENUM ('view', 'edit');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- Users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  city VARCHAR(100) DEFAULT NULL,
  country VARCHAR(100) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  profile_image VARCHAR(500) DEFAULT NULL,
  preferred_currency VARCHAR(10) DEFAULT 'USD',
  preferred_language VARCHAR(10) DEFAULT 'en',
  role user_role DEFAULT 'traveler',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Travel Interests (user preference tags)
-- ============================================
CREATE TABLE IF NOT EXISTS travel_interests (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  interest VARCHAR(50) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, interest)
);

-- ============================================
-- Destinations (Cities directory)
-- ============================================
CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  country VARCHAR(100) NOT NULL,
  region VARCHAR(100) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  image_url VARCHAR(500) DEFAULT NULL,
  cost_level cost_level_type DEFAULT 'moderate',
  popularity_score INT DEFAULT 0,
  recommended_days INT DEFAULT 3,
  latitude DECIMAL(10, 8) DEFAULT NULL,
  longitude DECIMAL(11, 8) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Activities (things to do at destinations)
-- ============================================
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  destination_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT DEFAULT NULL,
  category VARCHAR(50) NOT NULL,
  duration_hours DECIMAL(4, 1) DEFAULT 2.0,
  estimated_cost DECIMAL(10, 2) DEFAULT 0.00,
  rating DECIMAL(2, 1) DEFAULT 0.0,
  image_url VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

-- ============================================
-- Trips
-- ============================================
CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT DEFAULT NULL,
  cover_image VARCHAR(500) DEFAULT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  starting_location VARCHAR(200) DEFAULT NULL,
  budget DECIMAL(12, 2) DEFAULT 0.00,
  traveler_count INT DEFAULT 1,
  visibility trip_visibility DEFAULT 'private',
  status trip_status DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- Trip Stops (destination visits within a trip)
-- ============================================
CREATE TABLE IF NOT EXISTS trip_stops (
  id SERIAL PRIMARY KEY,
  trip_id INT NOT NULL,
  destination_id INT NOT NULL,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  stop_order INT NOT NULL DEFAULT 1,
  sequence_order INT NOT NULL DEFAULT 1,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE RESTRICT
);

-- ============================================
-- Scheduled Activities (activity on a specific day/time)
-- ============================================
CREATE TABLE IF NOT EXISTS scheduled_activities (
  id SERIAL PRIMARY KEY,
  trip_stop_id INT NOT NULL,
  activity_id INT DEFAULT NULL,
  custom_name VARCHAR(200) DEFAULT NULL,
  day_number INT NOT NULL,
  scheduled_time TIME DEFAULT NULL,
  duration_hours DECIMAL(4, 1) DEFAULT 2.0,
  estimated_cost DECIMAL(10, 2) DEFAULT 0.00,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (trip_stop_id) REFERENCES trip_stops(id) ON DELETE CASCADE,
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE SET NULL
);

-- ============================================
-- Accommodations
-- ============================================
CREATE TABLE IF NOT EXISTS accommodations (
  id SERIAL PRIMARY KEY,
  trip_stop_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  type accommodation_type DEFAULT 'hotel',
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  cost DECIMAL(10, 2) DEFAULT 0.00,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (trip_stop_id) REFERENCES trip_stops(id) ON DELETE CASCADE
);

-- ============================================
-- Transport Entries
-- ============================================
CREATE TABLE IF NOT EXISTS transports (
  id SERIAL PRIMARY KEY,
  trip_stop_id INT NOT NULL,
  mode transport_mode DEFAULT 'flight',
  from_location VARCHAR(200) DEFAULT NULL,
  to_location VARCHAR(200) DEFAULT NULL,
  departure_time TIMESTAMP DEFAULT NULL,
  arrival_time TIMESTAMP DEFAULT NULL,
  cost DECIMAL(10, 2) DEFAULT 0.00,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (trip_stop_id) REFERENCES trip_stops(id) ON DELETE CASCADE
);

-- ============================================
-- Expenses
-- ============================================
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  trip_id INT NOT NULL,
  trip_stop_id INT DEFAULT NULL,
  category expense_category NOT NULL,
  description VARCHAR(300) DEFAULT NULL,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) DEFAULT 'USD',
  expense_date DATE DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (trip_stop_id) REFERENCES trip_stops(id) ON DELETE SET NULL
);

-- ============================================
-- Saved Destinations
-- ============================================
CREATE TABLE IF NOT EXISTS saved_destinations (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  destination_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
  UNIQUE (user_id, destination_id)
);

-- ============================================
-- Community Itineraries
-- ============================================
CREATE TABLE IF NOT EXISTS community_itineraries (
  id SERIAL PRIMARY KEY,
  trip_id INT NOT NULL UNIQUE,
  tags VARCHAR(500) DEFAULT NULL,
  travel_style VARCHAR(100) DEFAULT NULL,
  likes_count INT DEFAULT 0,
  saves_count INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- ============================================
-- Trip Collaborators
-- ============================================
CREATE TABLE IF NOT EXISTS trip_collaborators (
  id SERIAL PRIMARY KEY,
  trip_id INT NOT NULL,
  user_id INT NOT NULL,
  permission collaborator_permission DEFAULT 'view',
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (trip_id, user_id)
);

-- ============================================
-- Public Share Links
-- ============================================
CREATE TABLE IF NOT EXISTS public_share_links (
  id SERIAL PRIMARY KEY,
  trip_id INT NOT NULL,
  share_token VARCHAR(100) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_visibility ON trips(visibility);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_activities_stop ON scheduled_activities(trip_stop_id);
CREATE INDEX IF NOT EXISTS idx_activities_destination ON activities(destination_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_destinations_country ON destinations(country);
CREATE INDEX IF NOT EXISTS idx_destinations_region ON destinations(region);
