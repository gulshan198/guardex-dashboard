import mongoose from 'mongoose';

const resolvedAlertSchema = new mongoose.Schema({
  originalAlertId: {
    type: String,
    required: true
  },
  alertType: {
    type: String,
    required: true,
    enum: ['loitering', 'idle_machinery', 'attendance', 'restricted', 'sleeping', 'phone', 'ppe_compliance', 'fire_smoke']
  },
  page: {
    type: String,
    required: true,
    enum: ['operations', 'compliance', 'security', 'alerts']
  },
  originalData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  resolvedAt: {
    type: Date,
    default: Date.now
  },
  resolvedBy: {
    type: String,
    default: 'Admin'
  },
  resolutionNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient queries
resolvedAlertSchema.index({ page: 1, alertType: 1, resolvedAt: -1 });
resolvedAlertSchema.index({ originalAlertId: 1 }, { unique: true });

export default mongoose.model('ResolvedAlert', resolvedAlertSchema); 