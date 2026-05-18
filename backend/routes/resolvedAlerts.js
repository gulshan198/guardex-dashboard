import express from 'express';
import ResolvedAlert from '../models/ResolvedAlert.js';

const router = express.Router();

// Get all resolved alerts for a specific page
router.get('/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const resolvedAlerts = await ResolvedAlert.find({ page })
      .sort({ resolvedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    res.json(resolvedAlerts);
  } catch (error) {
    console.error('Error fetching resolved alerts:', error);
    res.status(500).json({ error: 'Failed to fetch resolved alerts' });
  }
});

// Get resolved alerts by type for a specific page
router.get('/:page/:alertType', async (req, res) => {
  try {
    const { page, alertType } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const resolvedAlerts = await ResolvedAlert.find({ 
      page, 
      alertType 
    })
      .sort({ resolvedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    res.json(resolvedAlerts);
  } catch (error) {
    console.error('Error fetching resolved alerts by type:', error);
    res.status(500).json({ error: 'Failed to fetch resolved alerts' });
  }
});

// Create a new resolved alert (soft delete)
router.post('/', async (req, res) => {
  try {
    const {
      originalAlertId,
      alertType,
      page,
      originalData,
      resolvedBy = 'Admin',
      resolutionNotes = ''
    } = req.body;

    // Check if already resolved
    const existingResolved = await ResolvedAlert.findOne({ originalAlertId });
    if (existingResolved) {
      return res.status(400).json({ error: 'Alert already resolved' });
    }

    const resolvedAlert = new ResolvedAlert({
      originalAlertId,
      alertType,
      page,
      originalData,
      resolvedBy,
      resolutionNotes
    });

    await resolvedAlert.save();
    res.status(201).json(resolvedAlert);
  } catch (error) {
    console.error('Error creating resolved alert:', error);
    res.status(500).json({ error: 'Failed to create resolved alert' });
  }
});

// Get resolved alert by ID
router.get('/id/:id', async (req, res) => {
  try {
    const resolvedAlert = await ResolvedAlert.findById(req.params.id);
    if (!resolvedAlert) {
      return res.status(404).json({ error: 'Resolved alert not found' });
    }
    res.json(resolvedAlert);
  } catch (error) {
    console.error('Error fetching resolved alert:', error);
    res.status(500).json({ error: 'Failed to fetch resolved alert' });
  }
});

// Update resolved alert (e.g., add notes)
router.put('/:id', async (req, res) => {
  try {
    const { resolutionNotes, resolvedBy } = req.body;
    const updateData = {};
    
    if (resolutionNotes !== undefined) updateData.resolutionNotes = resolutionNotes;
    if (resolvedBy !== undefined) updateData.resolvedBy = resolvedBy;
    
    const resolvedAlert = await ResolvedAlert.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!resolvedAlert) {
      return res.status(404).json({ error: 'Resolved alert not found' });
    }
    
    res.json(resolvedAlert);
  } catch (error) {
    console.error('Error updating resolved alert:', error);
    res.status(500).json({ error: 'Failed to update resolved alert' });
  }
});

// Delete resolved alert (hard delete)
router.delete('/:id', async (req, res) => {
  try {
    const resolvedAlert = await ResolvedAlert.findByIdAndDelete(req.params.id);
    if (!resolvedAlert) {
      return res.status(404).json({ error: 'Resolved alert not found' });
    }
    res.json({ message: 'Resolved alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting resolved alert:', error);
    res.status(500).json({ error: 'Failed to delete resolved alert' });
  }
});

// Get statistics for resolved alerts
router.get('/stats/:page', async (req, res) => {
  try {
    const { page } = req.params;
    
    const stats = await ResolvedAlert.aggregate([
      { $match: { page } },
      {
        $group: {
          _id: '$alertType',
          count: { $sum: 1 },
          latestResolved: { $max: '$resolvedAt' }
        }
      }
    ]);
    
    const totalResolved = await ResolvedAlert.countDocuments({ page });
    
    res.json({
      totalResolved,
      byType: stats
    });
  } catch (error) {
    console.error('Error fetching resolved alert stats:', error);
    res.status(500).json({ error: 'Failed to fetch resolved alert stats' });
  }
});

export default router; 