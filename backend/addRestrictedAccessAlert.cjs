const mongoose = require('mongoose');
const { connectWithHandlers } = require('./config/db.cjs');

connectWithHandlers(async () => {
  console.log('Connected to MongoDB');

  try {
    const Alert = (await import('./models/Alert.js')).default;

    const restrictedAlert = new Alert({
      alert_type: 'restricted',
      camera_id: 'cam_03',
      person_id: 'EMP005',
      frame_timestamp: new Date(Date.now() - 45 * 60 * 1000),
      logged_at: new Date(Date.now() - 45 * 60 * 1000),
      image_id: '688df366c4729f04f9e094be',
      box_count: 1,
      zone: 'Restricted Area - Server Room',
      status: 'active',
      violation_type: 'unauthorized_entry',
    });

    await restrictedAlert.save();
    console.log('Successfully added 1 restricted access alert');

    const restrictedCount = await Alert.countDocuments({ alert_type: 'restricted' });
    console.log(`Total restricted access alerts in database: ${restrictedCount}`);
  } catch (error) {
    console.error('Error adding restricted access alert:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
});
