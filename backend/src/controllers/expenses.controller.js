const db = require('../config/db');

const expensesController = {
  async getTripExpenses(req, res, next) {
    try {
      const { tripId } = req.params;
      const { rows } = await db.query('SELECT * FROM expenses WHERE trip_id = $1 ORDER BY expense_date DESC', [tripId]);
      res.json(rows);
    } catch (error) {
      next(error);
    }
  },

  async addExpense(req, res, next) {
    try {
      const { tripId } = req.params;
      const { trip_stop_id, category, description, amount, currency, expense_date } = req.body;
      
      const { rows } = await db.query(
        `INSERT INTO expenses (trip_id, trip_stop_id, category, description, amount, currency, expense_date) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [tripId, trip_stop_id || null, category, description, amount, currency || 'USD', expense_date]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      next(error);
    }
  },

  async deleteExpense(req, res, next) {
    try {
      const { id } = req.params;
      await db.query('DELETE FROM expenses WHERE id = $1', [id]);
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  async getBudgetSummary(req, res, next) {
    try {
      const { tripId } = req.params;
      
      // Get trip budget
      const tripRes = await db.query('SELECT budget FROM trips WHERE id = $1', [tripId]);
      if (tripRes.rows.length === 0) return res.status(404).json({ error: 'Trip not found' });
      const totalBudget = Number(tripRes.rows[0].budget || 0);

      // Aggregate all expenses directly recorded
      const directExpRes = await db.query('SELECT SUM(amount) as total FROM expenses WHERE trip_id = $1', [tripId]);
      const directExpenses = Number(directExpRes.rows[0].total || 0);

      // Aggregate expenses and sub-items using a UNION query sum.
      
      const totalSumRes = await db.query(`
        SELECT SUM(total_cost) as grand_total FROM (
          SELECT amount as total_cost FROM expenses WHERE trip_id = $1
          UNION ALL
          SELECT estimated_cost as total_cost FROM scheduled_activities sa JOIN trip_stops ts ON sa.trip_stop_id = ts.id WHERE ts.trip_id = $1
          UNION ALL
          SELECT cost as total_cost FROM accommodations a JOIN trip_stops ts ON a.trip_stop_id = ts.id WHERE ts.trip_id = $1
          UNION ALL
          SELECT cost as total_cost FROM transports t JOIN trip_stops ts ON t.trip_stop_id = ts.id WHERE ts.trip_id = $1
        ) as combined_costs
      `, [tripId]);

      const totalSpent = Number(totalSumRes.rows[0].grand_total || 0);

      // Category breakdown (naive version for MVP)
      const activityRes = await db.query(`SELECT SUM(estimated_cost) as val FROM scheduled_activities sa JOIN trip_stops ts ON sa.trip_stop_id = ts.id WHERE ts.trip_id = $1`, [tripId]);
      const accRes = await db.query(`SELECT SUM(cost) as val FROM accommodations a JOIN trip_stops ts ON a.trip_stop_id = ts.id WHERE ts.trip_id = $1`, [tripId]);
      const transportRes = await db.query(`SELECT SUM(cost) as val FROM transports t JOIN trip_stops ts ON t.trip_stop_id = ts.id WHERE ts.trip_id = $1`, [tripId]);
      const miscRes = await db.query(`SELECT SUM(amount) as val FROM expenses WHERE trip_id = $1`, [tripId]);

      const breakdown = {
        activity: Number(activityRes.rows[0].val || 0),
        accommodation: Number(accRes.rows[0].val || 0),
        transport: Number(transportRes.rows[0].val || 0),
        misc: Number(miscRes.rows[0].val || 0)
      };
      
      // Ensure meal exists in breakdown (we map meals to misc or activity)
      breakdown.meal = 0;

      res.json({
        total_budget: totalBudget,
        total_spent: totalSpent,
        remaining: totalBudget - totalSpent,
        breakdown
      });

    } catch (error) {
      next(error);
    }
  }
};

module.exports = expensesController;
