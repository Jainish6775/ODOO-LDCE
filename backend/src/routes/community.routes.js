const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community.controller');
const { authenticate } = require('../middleware/auth');

// Public route to get public trips
router.get('/', communityController.getPublicTrips);

// Protected routes
router.use(authenticate);
router.post('/:tripId/like', communityController.likeTrip);
router.post('/:tripId/copy', communityController.copyTrip);

module.exports = router;
