import Alert from './models/Alert.js';
import { connectWithHandlers } from './config/db.js';

connectWithHandlers(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Add zones to remaining alerts
    const zoneUpdates = [
      { camera_id: "cam_02", zone: "Blow Moulding Room" },
      { camera_id: "cam_03", zone: "RO Section" },
      { camera_id: "cam_04", zone: "Filler Room" },
      { camera_id: "cam_05", zone: "Conveyer Belt" },
      { camera_id: "cam_06", zone: "QC Line" }
    ];

    console.log('Adding zones to remaining alerts...');

    for (const update of zoneUpdates) {
      const result = await Alert.updateMany(
        { camera_id: update.camera_id, zone: { $exists: false } },
        { $set: { zone: update.zone } }
      );
      console.log(`Added zone "${update.zone}" to ${result.modifiedCount} alerts from ${update.camera_id}`);
    }

    // Verify the updates
    const allAlerts = await Alert.find({}, 'camera_id violation_type zone');
    console.log('\nAll alerts with zones:');
    allAlerts.forEach(alert => {
      console.log(`${alert.camera_id}: ${alert.violation_type} - ${alert.zone || 'No zone'}`);
    });

    // Show breakdown by zone
    const zoneBreakdown = await Alert.aggregate([
      { $group: { _id: "$zone", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\nAlerts per zone:');
    zoneBreakdown.forEach(item => {
      console.log(`${item._id || 'No zone'}: ${item.count} alerts`);
    });

    // Show breakdown by camera
    const cameraBreakdown = await Alert.aggregate([
      { $group: { _id: "$camera_id", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\nAlerts per camera:');
    cameraBreakdown.forEach(item => {
      console.log(`${item._id}: ${item.count} alerts`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error adding zones:', error);
    process.exit(1);
  }
}); 