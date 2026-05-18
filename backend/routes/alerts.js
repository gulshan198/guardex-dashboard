import express from 'express';
import mongoose from 'mongoose';
import Alert from '../models/Alert.js';
import ResolvedAlert from '../models/ResolvedAlert.js';
import { ObjectId } from 'mongodb';
import { GridFSBucket } from 'mongodb';

const router = express.Router();

// Helper function to filter out resolved alerts
const filterResolvedAlerts = async (alerts) => {
  const resolvedAlerts = await ResolvedAlert.find({}, 'originalAlertId');
  const resolvedIds = resolvedAlerts.map(alert => alert.originalAlertId);
  return alerts.filter(alert => !resolvedIds.includes(alert._id.toString()));
};

// GET PPE compliance alerts - return all alerts for now
router.get('/ppe-compliance', async (req, res) => {
    try {
      // Get all PPE alerts
      const ppeAlerts = await Alert.find({ violation_type: 'PPE' });
      
      // Filter out already resolved alerts
      const activePpeAlerts = await filterResolvedAlerts(ppeAlerts);
      
      res.json(activePpeAlerts);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

// GET restricted alerts - return all alerts for now
router.get('/restricted', async (req, res) => {
    try {
      // Get all restricted alerts
      const restrictedAlerts = await Alert.find({ violation_type: 'unauthorized_entry' });
      
      // Filter out already resolved alerts
      const activeRestrictedAlerts = await filterResolvedAlerts(restrictedAlerts);
      
      res.json(activeRestrictedAlerts);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

// GET sleep alerts - return all alerts for now
router.get('/sleeping', async (req, res) => {
    try {
      const sleepAlerts = await Alert.find({ violation_type: 'sleeping' });
      const activeSleepAlerts = await filterResolvedAlerts(sleepAlerts);
      res.json(activeSleepAlerts);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

// GET phone alerts - return all alerts for now
router.get('/phone', async (req, res) => {
    try {
      const phoneAlerts = await Alert.find({ violation_type: 'on_phone' });
      const activePhoneAlerts = await filterResolvedAlerts(phoneAlerts);
      res.json(activePhoneAlerts);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

// GET Attendance alerts - return all alerts for now
router.get('/attendance', async (req, res) => {
    try {
      const alerts = await Alert.find({ alert_type: 'attendance' });
      const activeAttendanceAlerts = await filterResolvedAlerts(alerts);
      res.json(activeAttendanceAlerts);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

// GET idle machinery alerts - return all alerts for now
router.get('/idle_machinery', async (req, res) => {
    try {
      const idleAlerts = await Alert.find({ violation_type: 'idle_machinery' });
      const activeIdleAlerts = await filterResolvedAlerts(idleAlerts);
      res.json(activeIdleAlerts);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  
// GET loitering alerts - return all alerts for now
router.get('/loitering', async (req, res) => {
  try {
    const loiteringAlerts = await Alert.find({ violation_type: 'loitering' });
    const activeLoiteringAlerts = await filterResolvedAlerts(loiteringAlerts);
    res.json(activeLoiteringAlerts);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get images
router.get('/image/:image_id', async (req, res) => {
    try {
      const db = mongoose.connection.db;
      const bucket = new GridFSBucket(db, { bucketName: 'fs' });
  
      const fileId = new ObjectId(req.params.image_id);
  
      // Check if file exists
      const files = await db.collection('fs.files').find({ _id: fileId }).toArray();
      if (!files || files.length === 0) {
        return res.status(404).send('Image not found');
      }
  
      // Set correct MIME type
      res.set('Content-Type', files[0].contentType || 'image/jpeg');
  
      // Stream image
      bucket.openDownloadStream(fileId).pipe(res);
    } catch (err) {
      console.error("Image fetch error:", err.message);
      res.status(500).send({ error: err.message });
    }
  });

// routes/alerts.js
router.get('/fire-smoke', async (req, res) => {
    try {
      const alerts = await Alert.find({ 
        $or: [
          { violation_type: 'fire_smoke' },
          { violation_type: 'fire' },
          { violation_type: 'smoke' }
        ]
      });
      const activeFireSmokeAlerts = await filterResolvedAlerts(alerts);
      res.json(activeFireSmokeAlerts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
// GET all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find(); // Fetch all alerts from MongoDB
    res.json(alerts); // Send alerts as JSON response
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// POST a new alert (optional, for testing purposes)
router.post('/', async (req, res) => {
  try {
    const newAlert = new Alert(req.body); // Create a new alert document
    const savedAlert = await newAlert.save(); // Save to MongoDB
    res.status(201).json(savedAlert); // Send saved alert as response
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Delete a particular alert
router.delete('/:id', async (req, res) => {
    try {
      await Alert.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Alert deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;