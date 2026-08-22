const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth.routes');
const tripRoutes = require('./routes/trip.routes');
const destinationsRoutes = require('./routes/destinations.routes');
const activitiesRoutes = require('./routes/activities.routes');
const itineraryRoutes = require('./routes/itinerary.routes');
const communityRoutes = require('./routes/community.routes');

const app = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/stops', itineraryRoutes);
app.use('/api/community', communityRoutes);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
