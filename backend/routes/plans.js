const router = require('express').Router();
const Plan = require('../models/Plan');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'owner') return res.status(403).json({ message: 'Owner only' });
    const plans = await Plan.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'owner') return res.status(403).json({ message: 'Owner only' });
    const plan = await Plan.create({ ...req.body, owner: req.user.id });
    res.status(201).json(plan);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'owner') return res.status(403).json({ message: 'Owner only' });
    const plan = await Plan.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, req.body, { new: true });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'owner') return res.status(403).json({ message: 'Owner only' });
    await Plan.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
