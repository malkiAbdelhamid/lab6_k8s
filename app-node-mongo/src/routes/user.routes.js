const express = require('express');
const User = require('../models/user.model');
const Counter=require('../models/counter.model')
const router = express.Router();

// Helper function to get the next sequence value
async function getNextSequence(name) {
  const counter = await Counter.findByIdAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// Helper function to get the previous sequence value
async function getPreviousSequence(name) {
  const counter = await Counter.findByIdAndUpdate(
    { _id: name },
    { $inc: { seq: -1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const userId = await getNextSequence('userId'); // Get the next sequence
    const user = new User({ ...req.body, id: userId });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
    await getPreviousSequence('userId');
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a user by sequential ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update a user
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({id:req.params.id});
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
