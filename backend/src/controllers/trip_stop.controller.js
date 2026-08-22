const TripStopModel = require('../models/trip_stop.model');
const TripModel = require('../models/trip.model');

const tripStopController = {
  // Check if user owns the trip before allowing modifications
  async verifyTripOwnership(req, res, tripId) {
    const trip = await TripModel.findById(tripId);
    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return false;
    }
    if (trip.user_id !== req.user.id) {
      res.status(403).json({ error: 'Access denied.' });
      return false;
    }
    return true;
  },

  async addStop(req, res, next) {
    try {
      const { tripId } = req.params;
      const { destinationId, arrivalDate, departureDate, sequenceOrder, notes } = req.body;

      const hasAccess = await tripStopController.verifyTripOwnership(req, res, tripId);
      if (!hasAccess) return;

      if (!arrivalDate || !departureDate) {
        return res.status(400).json({ error: 'Arrival and departure dates are required.' });
      }

      const stopId = await TripStopModel.create({
        tripId,
        destinationId,
        arrivalDate,
        departureDate,
        sequenceOrder,
        notes
      });

      const newStop = await TripStopModel.findById(stopId);
      res.status(201).json(newStop);
    } catch (error) {
      next(error);
    }
  },

  async getStops(req, res, next) {
    try {
      const { tripId } = req.params;
      
      const trip = await TripModel.findById(tripId);
      if (!trip) return res.status(404).json({ error: 'Trip not found.' });
      // Depending on visibility, we might allow non-owners to view stops. 
      // For MVP, strict ownership checking for simplicity unless it's public.
      if (trip.user_id !== req.user.id && trip.visibility === 'private') {
         return res.status(403).json({ error: 'Access denied.' });
      }

      const stops = await TripStopModel.findAllByTrip(tripId);
      res.json(stops);
    } catch (error) {
      next(error);
    }
  },

  async updateStop(req, res, next) {
    try {
      const { tripId, stopId } = req.params;
      const updates = req.body;

      const hasAccess = await tripStopController.verifyTripOwnership(req, res, tripId);
      if (!hasAccess) return;

      const stop = await TripStopModel.findById(stopId);
      if (!stop || stop.trip_id != tripId) {
        return res.status(404).json({ error: 'Stop not found.' });
      }

      await TripStopModel.update(stopId, updates);
      const updatedStop = await TripStopModel.findById(stopId);
      res.json(updatedStop);
    } catch (error) {
      next(error);
    }
  },

  async deleteStop(req, res, next) {
    try {
      const { tripId, stopId } = req.params;
      
      const hasAccess = await tripStopController.verifyTripOwnership(req, res, tripId);
      if (!hasAccess) return;

      const stop = await TripStopModel.findById(stopId);
      if (!stop || stop.trip_id != tripId) {
        return res.status(404).json({ error: 'Stop not found.' });
      }

      await TripStopModel.delete(stopId);
      res.json({ message: 'Stop deleted successfully.' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = tripStopController;
