const { DataTypes } = require('sequelize');
const { sequelize } = require('./Item');

const StockAllocation = sequelize.define('StockAllocation', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

module.exports = { StockAllocation };
