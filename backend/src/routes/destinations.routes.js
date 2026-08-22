const express = require('express');
const router = express.Router();
const destinationsController = require('../controllers/destinations.controller');
const { authenticate } = require('../middleware/auth');

// Public or Protected depending on requirements. Master prompt implies search should be available, but usually explore is protected in this app.
// Let's make search protected to match standard logged-in usage (Explore page).
router.use(authenticate);

router.get('/', destinationsController.getDestinations);
router.get('/:id', destinationsController.getDestinationById);
router.get('/:id/activities', destinationsController.getActivitiesForDestination);

module.exports = router;
