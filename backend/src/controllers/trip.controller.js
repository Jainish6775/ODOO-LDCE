const TripModel = require('../models/trip.model');

const tripController = {
  async createTrip(req, res, next) {
    try {
      const { name, description, coverImage, startDate, endDate, startingLocation, budget, travelerCount, visibility } = req.body;
      const userId = req.user.id;

      if (!name || !startDate || !endDate) {
        return res.status(400).json({ error: 'Name, start date, and end date are required.' });
      }

      const tripId = await TripModel.create({
        userId,
        name,
        description,
        coverImage,
        startDate,
        endDate,
        startingLocation,
        budget,
        travelerCount,
        visibility
      });

      const newTrip = await TripModel.findById(tripId);
      res.status(201).json(newTrip);
    } catch (error) {
      next(error);
    }
  },

  async getMyTrips(req, res, next) {
    try {
      const { status, search, limit, offset } = req.query;
      const trips = await TripModel.findAllByUser(req.user.id, { 
        status, 
        search, 
        limit: parseInt(limit) || 50, 
        offset: parseInt(offset) || 0 
      });
      res.json(trips);
    } catch (error) {
      next(error);
    }
  },

  async getTrip(req, res, next) {
    try {
      const { id } = req.params;
      const trip = await TripModel.findById(id);

      if (!trip) {
        return res.status(404).json({ error: 'Trip not found.' });
      }

      // Ensure user owns the trip or it's shared/public
      // For now, strict ownership for MVP
      if (trip.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      res.json(trip);
    } catch (error) {
      next(error);
    }
  },

  async updateTrip(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const trip = await TripModel.findById(id);
      if (!trip) return res.status(404).json({ error: 'Trip not found.' });
      if (trip.user_id !== req.user.id) return res.status(403).json({ error: 'Access denied.' });

      await TripModel.update(id, updates);
      
      const updatedTrip = await TripModel.findById(id);
      res.json(updatedTrip);
    } catch (error) {
      next(error);
    }
  },

  async deleteTrip(req, res, next) {
    try {
      const { id } = req.params;
      
      const trip = await TripModel.findById(id);
      if (!trip) return res.status(404).json({ error: 'Trip not found.' });
      if (trip.user_id !== req.user.id) return res.status(403).json({ error: 'Access denied.' });

      await TripModel.delete(id);
      res.json({ message: 'Trip deleted successfully.' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = tripController;
