const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Handle JSON data
app.use(cors()); // Allow Cross-Origin requests

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes
const authRoutes = require('./routes/auth');
const gestionnaireRoutes = require('./routes/gestionnaire');

app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/auth', authRoutes);
app.use('/api/gestionnaire', gestionnaireRoutes);

// Load routes
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
