const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'https://rtsdocumentgeneration.vercel.app/',
     'https://rtsdocumentgeneration.vercel.app',
     'http://localhost:5173',
     'http://localhost:5173/'
  ],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Solar Installation Forms API',
    version: '1.0.0',
    endpoints: {
      workCompletion: {
        base: '/api/work-completion',
        methods: ['GET', 'POST', 'DELETE'],
        description: 'Work Completion Report form endpoints'
      },
      multiPurpose: {
        base: '/api/multi-purpose',
        methods: ['GET', 'POST', 'DELETE'],
        description: 'Multi-Purpose form endpoints'
      }
    },
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
const workCompletionRoutes = require('./routes/workCompletion');
const multiPurposeFormRoutes = require('./routes/multiPurposeForm');

app.use('/api/work-completion', workCompletionRoutes);
app.use('/api/multi-purpose', multiPurposeFormRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 