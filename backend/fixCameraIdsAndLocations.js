import Alert from './models/Alert.js';
import { connectWithHandlers } from './config/db.js';

connectWithHandlers(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Update camera IDs and add zones
    const updates = [
      // Fix camera IDs and add diverse zones
      { 
        camera_id: "CAM002", 
        newCameraId: "cam_02", 
        zone: "Blow Moulding Room" 
      },
      { 
        camera_id: "CAM003", 
        newCameraId: "cam_03", 
        zone: "RO Section" 
      },
      { 
        camera_id: "CAM004", 
        newCameraId: "cam_04", 
        zone: "Filler Room" 
      },
      { 
        camera_id: "CAM005", 
        newCameraId: "cam_05", 
        zone: "Conveyer Belt" 
      },
      { 
        camera_id: "CAM006", 
        newCameraId: "cam_06", 
        zone: "QC Line" 
      }
    ];

    // Also update original cam_01 to have diverse zones
    const originalUpdates = [
      { camera_id: "cam_01", zone: "Blow Moulding Room" },
      { camera_id: "cam_01", zone: "RO Section" },
      { camera_id: "cam_01", zone: "Filler Room" },
      { camera_id: "cam_01", zone: "Conveyer Belt" },
      { camera_id: "cam_01", zone: "QC Line" }
    ];

    console.log('Updating camera IDs and adding zones...');

    // Update new alerts with proper camera IDs and zones
    for (const update of updates) {
      const result = await Alert.updateMany(
        { camera_id: update.camera_id },
        { 
          $set: { 
            camera_id: update.newCameraId,
            zone: update.zone
          } 
        }
      );
      console.log(`Updated ${result.modifiedCount} alerts from ${update.camera_id} to ${update.newCameraId} (${update.zone})`);
    }

    // Update original cam_01 alerts with diverse zones
    const cam01Alerts = await Alert.find({ camera_id: "cam_01" });
    for (let i = 0; i < cam01Alerts.length; i++) {
      const zoneIndex = i % originalUpdates.length;
      const zone = originalUpdates[zoneIndex].zone;
      
      await Alert.updateOne(
        { _id: cam01Alerts[i]._id },
        { $set: { zone: zone } }
      );
      console.log(`Updated cam_01 alert ${i + 1} with zone: ${zone}`);
    }

    // Verify the updates
    const allAlerts = await Alert.find({}, 'camera_id violation_type zone');
    console.log('\nUpdated alerts with zones:');
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
    console.error('Error updating camera IDs and zones:', error);
    process.exit(1);
  }
}); 