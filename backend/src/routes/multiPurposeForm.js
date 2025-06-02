const express = require('express');
const router = express.Router();
const MultiPurposeForm = require('../models/MultiPurposeForm');

// Get all multi-purpose forms
router.get('/', async (req, res) => {
  try {
    const forms = await MultiPurposeForm.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single multi-purpose form
router.get('/:id', async (req, res) => {
  try {
    const form = await MultiPurposeForm.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new multi-purpose form
router.post('/', async (req, res) => {
  const form = new MultiPurposeForm(req.body);
  try {
    const newForm = await form.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a multi-purpose form
router.delete('/:id', async (req, res) => {
  try {
    const form = await MultiPurposeForm.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    await form.deleteOne();
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 