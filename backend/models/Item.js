const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  manufacturer: {
    type: DataTypes.STRING
  },
  color: {
    type: DataTypes.STRING
  },
  qty: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  unit_cost: {
    type: DataTypes.FLOAT
  },
  barcode: {
    type: DataTypes.STRING,
    unique: true
  }
});

module.exports = { Item, sequelize };
