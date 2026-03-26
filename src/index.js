require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow all origins for local development
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Recetario API' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
