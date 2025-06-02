const express = require('express');
const router = express.Router();
const MultiPurposeForm = require('../models/MultiPurposeForm');
const mongoose = require('mongoose');

// Create indexes after connection is established
const createIndexes = async () => {
  try {
    if (mongoose.connection.readyState === 1) { // Check if connected
      console.log('Creating indexes for MultiPurposeForm...');
      await MultiPurposeForm.collection.createIndex({ consumerName: 1 });
      await MultiPurposeForm.collection.createIndex({ consumerNumber: 1 });
      await MultiPurposeForm.collection.createIndex({ createdAt: -1 });
      console.log('Indexes created successfully');
    } else {
      console.log('MongoDB not connected, skipping index creation');
    }
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

// Create indexes when connection is established
mongoose.connection.on('connected', createIndexes);

// GET all forms with pagination and timeout
router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected. Current state:', mongoose.connection.readyState);
      return res.status(503).json({ error: 'Database not connected' });
    }

    console.log('Starting to fetch forms...');
    const startTime = Date.now();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log(`Fetching page ${page} with limit ${limit}`);

    // Set a longer timeout for the query
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Query timeout')), 30000); // 30 seconds
    });

    // First, get the total count
    console.log('Getting total count...');
    const total = await MultiPurposeForm.countDocuments();
    console.log(`Total documents: ${total}`);

    // Then get the paginated data
    console.log('Fetching paginated data...');
    const queryPromise = MultiPurposeForm.find()
      .select('consumerName consumerNumber mobileNumber createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const forms = await Promise.race([queryPromise, timeoutPromise]);
    console.log(`Fetched ${forms.length} forms in ${Date.now() - startTime}ms`);

    res.json({
      forms,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      time: new Date().toISOString()
    });

    if (error.message === 'Query timeout') {
      res.status(504).json({ 
        error: 'Request timed out. Please try again.',
        details: 'The database query took too long to execute. Try reducing the page size or try again later.'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch forms',
        details: error.message
      });
    }
  }
});

// GET single form
router.get('/:id', async (req, res) => {
  try {
    const form = await MultiPurposeForm.findById(req.params.id).lean();
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

// POST new form
router.post('/', async (req, res) => {
  try {
    const form = new MultiPurposeForm(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ error: 'Failed to create form' });
  }
});

// DELETE form
router.delete('/:id', async (req, res) => {
  try {
    const form = await MultiPurposeForm.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ error: 'Failed to delete form' });
  }
});

module.exports = router; 