const mongoose = require('mongoose');

// MongoDB connection string
// Replace 'your_database_url' with your actual connection string
const mongoDB = 'mongodb://localhost:27017';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err));
