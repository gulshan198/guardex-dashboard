import Alert from './models/Alert.js';
import { connectWithHandlers } from './config/db.js';

connectWithHandlers(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Additional realistic alert data
    const additionalAlerts = [
      // PPE Violations (3 more)
      {
        camera_id: "CAM002",
        person_id: "EMP004",
        frame_timestamp: "2025-08-02T10:45:00.000Z",
        logged_at: "2025-08-02T10:45:01.200Z",
        image_id: "688dd5df17529703e95bc2a2", // Reuse existing PPE image
        violation_type: "PPE",
        projectId: "688da73c6f07fc5be8c44013"
      },
      {
        camera_id: "CAM003",
        person_id: "EMP005",
        frame_timestamp: "2025-08-02T11:20:00.000Z",
        logged_at: "2025-08-02T11:20:01.500Z",
        image_id: "688dd637591345a66ae61099", // Reuse existing PPE image
        violation_type: "PPE",
        projectId: "688da73c6f07fc5be8c44013"
      },
      {
        camera_id: "CAM004",
        person_id: "EMP006",
        frame_timestamp: "2025-08-02T12:15:00.000Z",
        logged_at: "2025-08-02T12:15:01.800Z",
        image_id: "688dd639591345a66ae6109c", // Reuse existing PPE image
        violation_type: "PPE",
        projectId: "688da73c6f07fc5be8c44013"
      },

      // Loitering Alerts (2 more)
      {
        camera_id: "CAM002",
        frame_timestamp: "2025-08-02T11:30:00.000Z",
        logged_at: "2025-08-02T11:30:01.300Z",
        image_id: "688dd859b523d4a410378399", // Reuse existing loitering image
        box_count: 2,
        boxes: [
          [277.07098388671875, 233.55776977539062, 410.1813049316406, 477.14007568359375],
          [145.30767822265625, 281.00628662109375, 278.7472229003906, 467.12457275390625]
        ],
        violation_type: "loitering"
      },
      {
        camera_id: "CAM003",
        frame_timestamp: "2025-08-02T12:45:00.000Z",
        logged_at: "2025-08-02T12:45:01.600Z",
        image_id: "688dd96d0582cae0bdca726e", // Reuse existing loitering image
        box_count: 1,
        boxes: [
          [499.93499755859375, 150.14816284179688, 607.6585693359375, 434.7623291015625]
        ],
        violation_type: "loitering"
      },

      // Phone Usage (2 more)
      {
        camera_id: "CAM003",
        person_id: "EMP007",
        frame_timestamp: "2025-08-02T10:15:00.000Z",
        logged_at: "2025-08-02T10:15:01.400Z",
        image_id: "688dded98d9b50a91951bd77", // Reuse existing phone image
        violation_type: "on_phone"
      },
      {
        camera_id: "CAM004",
        person_id: "EMP008",
        frame_timestamp: "2025-08-02T11:50:00.000Z",
        logged_at: "2025-08-02T11:50:01.700Z",
        image_id: "688ddf20724e454c87873aa1", // Reuse existing phone image
        violation_type: "on_phone"
      },

      // Sleeping (2 more)
      {
        camera_id: "CAM002",
        person_id: "EMP009",
        frame_timestamp: "2025-08-02T14:30:00.000Z",
        logged_at: "2025-08-02T14:30:01.900Z",
        image_id: "688dded98d9b50a91951bd77", // Reuse existing image
        violation_type: "sleeping"
      },
      {
        camera_id: "CAM003",
        person_id: "EMP010",
        frame_timestamp: "2025-08-02T15:15:00.000Z",
        logged_at: "2025-08-02T15:15:02.100Z",
        image_id: "688ddf20724e454c87873aa1", // Reuse existing image
        violation_type: "sleeping"
      },

      // Idle Machinery (1 more)
      {
        camera_id: "CAM004",
        frame_timestamp: "2025-08-02T13:20:00.000Z",
        alert_type: "idle_machinery",
        image_id: "688ddd80769c2e4ec6e92382", // Reuse existing idle machinery image
        created_at: "2025-08-02T13:20:02.500Z",
        violation_type: "idle_machinery",
        logged_at: "2025-08-02T13:30:30.740Z"
      },

      // Unauthorized Entry (1 more)
      {
        camera_id: "CAM005",
        person_id: "EMP011",
        frame_timestamp: "2025-08-02T09:30:00.000Z",
        logged_at: "2025-08-02T09:30:01.100Z",
        image_id: "688dd5df17529703e95bc2a2", // Reuse existing image
        violation_type: "unauthorized_entry"
      },

      // Fire/Smoke (1 more)
      {
        camera_id: "CAM006",
        frame_timestamp: "2025-08-02T16:45:00.000Z",
        logged_at: "2025-08-02T16:45:01.300Z",
        image_id: "688dd859b523d4a410378399", // Reuse existing image
        violation_type: "fire_smoke"
      }
    ];
    
    // Insert additional alerts
    await Alert.insertMany(additionalAlerts);
    console.log('Additional alerts inserted successfully');
    
    // Verify the data
    const count = await Alert.countDocuments();
    console.log(`Total alerts in database: ${count}`);
    
    // Show breakdown by violation type
    const breakdown = await Alert.aggregate([
      { $group: { _id: "$violation_type", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\nAlert breakdown by type:');
    breakdown.forEach(item => {
      console.log(`${item._id}: ${item.count} alerts`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding alerts:', error);
    process.exit(1);
  }
}); 