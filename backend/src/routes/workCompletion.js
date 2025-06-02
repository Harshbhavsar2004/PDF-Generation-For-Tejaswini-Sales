const express = require('express');
const router = express.Router();
const WorkCompletion = require('../models/WorkCompletion');

// Get all work completion forms
router.get('/', async (req, res) => {
  try {
    const forms = await WorkCompletion.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single work completion form
router.get('/:id', async (req, res) => {
  try {
    const form = await WorkCompletion.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new work completion form
router.post('/', async (req, res) => {
  const form = new WorkCompletion(req.body);
  try {
    const newForm = await form.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a work completion form
router.delete('/:id', async (req, res) => {
  try {
    const form = await WorkCompletion.findById(req.params.id);
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