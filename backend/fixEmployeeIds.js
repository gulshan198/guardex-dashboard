import Alert from './models/Alert.js';
import { connectWithHandlers } from './config/db.js';

connectWithHandlers(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Fix employee ID inconsistencies
    const employeeIdUpdates = [
      { oldId: "EMP004", newId: "4" },
      { oldId: "EMP005", newId: "5" },
      { oldId: "EMP006", newId: "7" },
      { oldId: "EMP007", newId: "8" },
      { oldId: "EMP008", newId: "9" },
      { oldId: "EMP009", newId: "10" },
      { oldId: "EMP010", newId: "11" },
      { oldId: "EMP011", newId: "12" }
    ];

    console.log('Fixing employee ID inconsistencies...');

    for (const update of employeeIdUpdates) {
      const result = await Alert.updateMany(
        { person_id: update.oldId },
        { $set: { person_id: update.newId } }
      );
      console.log(`Updated ${result.modifiedCount} alerts from ${update.oldId} to ${update.newId}`);
    }

    // Verify the updates
    const allAlerts = await Alert.find({}, 'camera_id violation_type person_id zone');
    console.log('\nUpdated alerts with consistent employee IDs:');
    allAlerts.forEach(alert => {
      console.log(`${alert.camera_id}: ${alert.violation_type} - Employee: ${alert.person_id || 'N/A'} - Zone: ${alert.zone || 'N/A'}`);
    });

    // Show breakdown by employee ID
    const employeeBreakdown = await Alert.aggregate([
      { $group: { _id: "$person_id", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\nAlerts per employee ID:');
    employeeBreakdown.forEach(item => {
      console.log(`Employee ${item._id || 'N/A'}: ${item.count} alerts`);
    });

    // Show breakdown by violation type
    const violationBreakdown = await Alert.aggregate([
      { $group: { _id: "$violation_type", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\nAlerts per violation type:');
    violationBreakdown.forEach(item => {
      console.log(`${item._id}: ${item.count} alerts`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error fixing employee IDs:', error);
    process.exit(1);
  }
}); 