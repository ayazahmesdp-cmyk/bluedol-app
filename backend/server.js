require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const frontendPath = path.join(__dirname, 'frontend');
app.use(express.static(frontendPath));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/staff', require('./routes/staff'));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB error:', err);
    process.exit(1);
  });
