// index.js
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const itemRoutes = require('./routes/item');
const quoteRoutes = require('./routes/quote');
const { StockAllocation } = require('./models/StockAllocation');




//const { sequelize } = require('./models/Item');

sequelize.authenticate()
  .then(() => {
    console.log('Database connection established.');
    return sequelize.sync();
  })
  .then(() => console.log('Database & tables created!'))
  .catch(error => console.error('Unable to connect to the database or create tables:', error));

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

app.use('/api/items', itemRoutes);
app.use('/api/quotes', quoteRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});
