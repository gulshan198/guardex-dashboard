import mongoose from 'mongoose';


const alertSchema = new mongoose.Schema({
  // 🔍 Core fields (now all optional)
  camera_id:       { type: String },
  person_id:       { type: String },
  frame_timestamp: { type: Date },
  logged_at:       { type: Date, default: Date.now },
  image_id:        { type: String },
  box_count:       { type: Number },

  // 🧾 Meta fields for frontend rendering (optional)
  alert_type:  { type: String },
  emp_id:      { type: String },  // employee ID if known
  known:           { type: Boolean, default: false }, // true if emp_id is known
  violation_type:  { type: String },  // e.g., 'PPE', 'Fire', 'Smoke'
  id:              { type: String },  // for frontend compatibility
  name:            { type: String },  // employee name if available
  time:            { type: String },  // human-readable time string
  violation:       { type: String },  // e.g., "Hairnet Missing"
  zone:            { type: String },  // mapped from camera
  status:          { type: String }   // e.g., "Detected", "Present"
});

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
