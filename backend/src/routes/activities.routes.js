const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activities.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', activitiesController.searchActivities);
router.get('/:id', activitiesController.getActivityById);

module.exports = router;
