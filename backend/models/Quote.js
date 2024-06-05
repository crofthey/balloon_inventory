const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quote = sequelize.define('Quote', {
  // Existing fields
  reference: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false
  },
  laborCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  margin: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  isMarginPercentage: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  // New fields
  totalCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  profit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  // Timestamps
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Quote;
