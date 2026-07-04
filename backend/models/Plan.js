const mongoose = require('mongoose');
const planSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'Sales strategy' },
  startDate: { type: Date },
  targetDate: { type: Date },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  goal: { type: String, default: '' },
  budget: { type: Number, default: 0 },
  teamSize: { type: Number, default: 1 },
  status: { type: String, enum: ['Draft', 'Active', 'On hold', 'Completed'], default: 'Draft' },
  notes: { type: String, default: '' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Plan', planSchema);
