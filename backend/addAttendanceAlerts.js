import mongoose from 'mongoose';
import Alert from './models/Alert.js';
import { connectWithHandlers } from './config/db.js';

connectWithHandlers(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Create 3 attendance alerts with Indian names
    const attendanceAlerts = [
      {
        alert_type: 'attendance',
        person_id: 'EMP001',
        name: 'Rajesh Kumar',
        camera_id: 'cam_01',
        zone: 'Main Entrance',
        frame_timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'present',
        time: '08:15 AM',
        emp_id: 'EMP001',
        known: true,
        violation_type: 'attendance'
      },
      {
        alert_type: 'attendance',
        person_id: 'EMP002',
        name: 'Priya Sharma',
        camera_id: 'cam_02',
        zone: 'QC Department',
        frame_timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        status: 'present',
        time: '08:30 AM',
        emp_id: 'EMP002',
        known: true,
        violation_type: 'attendance'
      },
      {
        alert_type: 'attendance',
        person_id: 'EMP003',
        name: 'Amit Patel',
        camera_id: 'cam_03',
        zone: 'Blow Moulding Room',
        frame_timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        status: 'present',
        time: '08:45 AM',
        emp_id: 'EMP003',
        known: true,
        violation_type: 'attendance'
      }
    ];

    // Insert the alerts
    const result = await Alert.insertMany(attendanceAlerts);
    console.log('Successfully added 3 attendance alerts with Indian names:');
    result.forEach(alert => {
      console.log(`- ${alert.name} (${alert.person_id}) - ${alert.zone} at ${alert.time}`);
    });

    console.log('\nTotal alerts added:', result.length);
    
  } catch (error) {
    console.error('Error adding attendance alerts:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}); 