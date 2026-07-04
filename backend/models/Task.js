const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In progress', 'Done', 'Overdue'], default: 'Pending' },
  mode: { type: String, default: 'Field visit' },
  expectedOutcome: { type: String, default: '' },
  relatedPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', default: null },
  staffNote: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Task', taskSchema);
