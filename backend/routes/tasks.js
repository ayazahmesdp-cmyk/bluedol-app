const router = require('express').Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let query = req.user.role === 'owner' ? { assignedBy: req.user.id } : { assignedTo: req.user.id };
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name')
      .populate('relatedPlan', 'title')
      .sort({ createdAt: -1 });
    const now = new Date();
    for (const task of tasks) {
      if (task.dueDate && task.dueDate < now && task.status !== 'Done' && task.status !== 'Overdue') {
        task.status = 'Overdue'; await task.save();
      }
    }
    res.json(tasks);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'owner') return res.status(403).json({ message: 'Owner only' });
    const task = await Task.create({ ...req.body, assignedBy: req.user.id });
    const populated = await task.populate(['assignedTo', 'relatedPlan']);
    res.status(201).json(populated);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    let update = req.user.role === 'staff' ? { status: req.body.status, staffNote: req.body.staffNote } : req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('assignedTo', 'name email').populate('assignedBy', 'name').populate('relatedPlan', 'title');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'owner') return res.status(403).json({ message: 'Owner only' });
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
