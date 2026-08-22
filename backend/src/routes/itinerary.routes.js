const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itinerary.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// Activities
router.get('/:stopId/activities', itineraryController.getActivitiesForStop);
router.post('/:stopId/activities', itineraryController.addActivity);
router.delete('/:stopId/activities/:id', itineraryController.deleteActivity);

// Accommodations
router.post('/:stopId/accommodation', itineraryController.addAccommodation);
router.delete('/:stopId/accommodation/:id', itineraryController.deleteAccommodation);

// Transports
router.post('/:stopId/transport', itineraryController.addTransport);
router.delete('/:stopId/transport/:id', itineraryController.deleteTransport);

module.exports = router;
