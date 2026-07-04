const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const sign = (user) => jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid email or password' });
    res.json({ token: sign(user), role: user.role, name: user.name, id: user._id });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/register', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'owner') return res.status(403).json({ message: 'Only owner can add staff' });
    const { name, email, password, phone, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, phone, role: role || 'staff' });
    res.status(201).json({ message: 'User created', id: user._id });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/setup', async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count > 0) return res.status(400).json({ message: 'Setup already done' });
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password, role: 'owner' });
    res.status(201).json({ message: 'Owner account created', token: sign(user), role: 'owner', name: user.name, id: user._id });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
