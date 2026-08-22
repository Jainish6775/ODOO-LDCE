const express = require('express');
const tripController = require('../controllers/trip.controller');
const tripStopController = require('../controllers/trip_stop.controller');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All trip routes require authentication
router.use(authenticate);

const expensesController = require('../controllers/expenses.controller');

// --- Trip Routes ---
router.get('/', tripController.getMyTrips);
router.post('/', tripController.createTrip);
router.get('/:id', tripController.getTrip);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

// --- Budget & Expenses Routes ---
router.get('/:tripId/budget', expensesController.getBudgetSummary);
router.get('/:tripId/expenses', expensesController.getTripExpenses);
router.post('/:tripId/expenses', expensesController.addExpense);
router.delete('/:tripId/expenses/:id', expensesController.deleteExpense);

// --- Trip Stop Routes ---
router.get('/:tripId/stops', tripStopController.getStops);
router.post('/:tripId/stops', tripStopController.addStop);
router.put('/:tripId/stops/reorder', tripStopController.reorderStops);
router.put('/:tripId/stops/:stopId', tripStopController.updateStop);
router.delete('/:tripId/stops/:stopId', tripStopController.deleteStop);

module.exports = router;
