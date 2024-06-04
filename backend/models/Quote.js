const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quote = sequelize.define('Quote', {
  reference: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false
  },
  laborCost: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  margin: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  isMarginPercentage: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

module.exports = Quote;
