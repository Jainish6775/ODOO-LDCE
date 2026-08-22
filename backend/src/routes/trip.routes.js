const express = require('express');
const tripController = require('../controllers/trip.controller');
const tripStopController = require('../controllers/trip_stop.controller');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All trip routes require authentication
router.use(authenticate);

// --- Trip Routes ---
router.get('/', tripController.getMyTrips);
router.post('/', tripController.createTrip);
router.get('/:id', tripController.getTrip);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

// --- Trip Stop Routes ---
router.get('/:tripId/stops', tripStopController.getStops);
router.post('/:tripId/stops', tripStopController.addStop);
router.put('/:tripId/stops/:stopId', tripStopController.updateStop);
router.delete('/:tripId/stops/:stopId', tripStopController.deleteStop);

module.exports = router;
