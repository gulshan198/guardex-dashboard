import Alert from './models/Alert.js';
import { connectWithHandlers } from './config/db.js';

connectWithHandlers(async () => {
  console.log('Connected to MongoDB');
  try {
    // Get all current alerts
    const allAlerts = await Alert.find({});
    console.log(`Found ${allAlerts.length} alerts to fix`);

    // Define realistic time progression (workday from 8 AM to 6 PM)
    const baseTime = new Date('2025-08-02T08:00:00.000Z');
    const timeIncrements = [
      0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330
    ];

    // Define camera-zone mapping for consistency
    const cameraZones = {
      'cam_01': 'Blow Moulding Room',
      'cam_02': 'RO Section', 
      'cam_03': 'Filler Room',
      'cam_04': 'Conveyer Belt',
      'cam_05': 'QC Line',
      'cam_06': 'Main Gate'
    };

    // Define person assignments (avoid too many from same person)
    const personAssignments = [
      '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'
    ];

    // Update each alert with realistic data
    for (let i = 0; i < allAlerts.length; i++) {
      const alert = allAlerts[i];
      const timeOffset = timeIncrements[i] || (i * 15); // 15-minute intervals
      const newFrameTime = new Date(baseTime.getTime() + timeOffset * 60000);
      const newLoggedTime = new Date(newFrameTime.getTime() + 1000 + Math.random() * 2000); // 1-3 seconds later

      // Assign consistent person_id (avoid null for PPE/phone/sleeping alerts)
      let newPersonId = null;
      if (alert.violation_type === 'idle_machinery' || alert.violation_type === 'fire_smoke') {
        newPersonId = null; // Machinery and fire alerts don't need person_id
      } else {
        newPersonId = personAssignments[i % personAssignments.length];
      }

      // Get consistent zone for this camera
      const newZone = cameraZones[alert.camera_id] || 'Unknown Zone';

      // Update the alert
      await Alert.updateOne(
        { _id: alert._id },
        {
          $set: {
            frame_timestamp: newFrameTime.toISOString(),
            logged_at: newLoggedTime.toISOString(),
            person_id: newPersonId,
            zone: newZone
          }
        }
      );

      console.log(`Updated alert ${i + 1}: ${alert.camera_id} - ${alert.violation_type} at ${newFrameTime.toLocaleTimeString()}`);
    }

    // Verify the updates
    const updatedAlerts = await Alert.find({}, 'camera_id violation_type frame_timestamp logged_at person_id zone').sort({ frame_timestamp: 1 });
    console.log('\nUpdated alerts (chronological order):');
    updatedAlerts.forEach((alert, index) => {
      console.log(`${index + 1}. ${alert.camera_id} - ${alert.violation_type} - ${alert.person_id || 'N/A'} - ${alert.zone} - ${new Date(alert.frame_timestamp).toLocaleTimeString()}`);
    });

    // Show breakdown by violation type
    const violationBreakdown = await Alert.aggregate([
      { $group: { _id: "$violation_type", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\nAlerts by violation type:');
    violationBreakdown.forEach(item => {
      console.log(`${item._id}: ${item.count} alerts`);
    });

    // Show breakdown by zone
    const zoneBreakdown = await Alert.aggregate([
      { $group: { _id: "$zone", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\nAlerts by zone:');
    zoneBreakdown.forEach(item => {
      console.log(`${item._id}: ${item.count} alerts`);
    });

    console.log('\nAlert data fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing alert data:', error);
    process.exit(1);
  }
}); 