import Alert from './models/Alert.js';
import { connectWithHandlers } from './config/db.js';

connectWithHandlers(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Clear existing alerts
    await Alert.deleteMany({});
    console.log('Cleared existing alerts');
    
    // Sample alert data matching backend routes
    const sampleAlerts = [
      {
        camera_id: "CAM001",
        person_id: "EMP001",
        frame_timestamp: "2024-01-01T10:30:00Z",
        image_id: "img_001",
        violation_type: "loitering",
        logged_at: "2024-01-01T10:30:00Z",
        box_count: 2
      },
      {
        camera_id: "CAM002",
        person_id: "EMP002",
        frame_timestamp: "2024-01-01T11:15:00Z",
        image_id: "img_002",
        violation_type: "idle_machinery",
        logged_at: "2024-01-01T11:15:00Z"
      },
      {
        camera_id: "CAM003",
        emp_id: "EMP003",
        frame_timestamp: "2024-01-01T09:45:00Z",
        image_id: "img_003",
        alert_type: "attendance",
        logged_at: "2024-01-01T09:45:00Z"
      },
      {
        camera_id: "CAM004",
        person_id: "EMP004",
        frame_timestamp: "2024-01-01T12:20:00Z",
        image_id: "img_004",
        violation_type: "unauthorized_entry",
        logged_at: "2024-01-01T12:20:00Z"
      },
      {
        camera_id: "CAM005",
        person_id: "EMP005",
        frame_timestamp: "2024-01-01T13:10:00Z",
        image_id: "img_005",
        violation_type: "sleeping",
        logged_at: "2024-01-01T13:10:00Z"
      },
      {
        camera_id: "CAM006",
        person_id: "EMP006",
        frame_timestamp: "2024-01-01T14:05:00Z",
        image_id: "img_006",
        violation_type: "on_phone",
        logged_at: "2024-01-01T14:05:00Z"
      },
      {
        camera_id: "CAM007",
        person_id: "EMP007",
        frame_timestamp: "2024-01-01T15:30:00Z",
        image_id: "img_007",
        violation_type: "PPE",
        logged_at: "2024-01-01T15:30:00Z"
      },
      {
        camera_id: "CAM008",
        person_id: "EMP008",
        frame_timestamp: "2024-01-01T16:45:00Z",
        image_id: "img_008",
        violation_type: "fire_smoke",
        logged_at: "2024-01-01T16:45:00Z"
      }
    ];
    
    // Insert sample alerts
    await Alert.insertMany(sampleAlerts);
    console.log('Sample alerts inserted successfully');
    
    // Verify the data
    const count = await Alert.countDocuments();
    console.log(`Total alerts in database: ${count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}); 