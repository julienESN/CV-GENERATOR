/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { name }] });
    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? 'Email is already taken'
            : 'Name is already taken',
      });
    }

    const user = new User({ name, email, password });
    const userId = uuidv4();
    await user.save();

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;
