const express = require('express');
const router = express.Router();
const { Item } = require('../models/Item');
const { StockAllocation } = require('../models/StockAllocation');

// Fetch all items
router.get('/', async (req, res) => {
  try {
    console.log('GET request to /api/items');
    const items = await Item.findAll();
    console.log('Items fetched:', items);
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Add a new item
router.post('/add', async (req, res) => {
  try {
    console.log('POST request to /api/items/add with data:', req.body);
    const { name, manufacturer, color, qty, unit_cost, barcode } = req.body;
    const item = await Item.create({ name, manufacturer, color, qty, unit_cost, barcode });
    console.log('Item added:', item);
    res.json(item);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// Use items and create a stock allocation record
router.post('/use', async (req, res) => {
  try {
    console.log('POST request to /api/items/use with data:', req.body);
    const { name, description, items } = req.body; // [{ id, qty }]
    const usedItems = [];

    for (const item of items) {
      let balloon = await Item.findByPk(item.id);
      if (balloon) {
        balloon.qty -= item.qty;
        await balloon.save();
        usedItems.push({ id: item.id, name: balloon.name, qty: item.qty });
        console.log(`Updated item ${item.id} with new quantity: ${balloon.qty}`);
      } else {
        console.log(`Item with id ${item.id} not found`);
      }
    }

    const allocation = await StockAllocation.create({ name, description, items: usedItems });
    console.log('Stock allocation created:', allocation);
    res.json({ success: true, allocation });
  } catch (error) {
    console.error('Error using items:', error);
    res.status(500).json({ error: 'Failed to use items' });
  }
});

// Fetch historical stock allocations
router.get('/history', async (req, res) => {
  try {
    console.log('GET request to /api/items/history');
    const allocations = await StockAllocation.findAll();
    console.log('Allocations fetched:', allocations);
    res.json(allocations);
  } catch (error) {
    console.error('Error fetching allocations:', error);
    res.status(500).json({ error: 'Failed to fetch allocations' });
  }
});

// Update item quantity
router.put('/update-quantity/:id', async (req, res) => {
  try {
    console.log('PUT request to /api/items/update-quantity with data:', req.body);
    const { id } = req.params;
    const { qty } = req.body;

    const item = await Item.findByPk(id);
    if (item) {
      item.qty = qty;
      await item.save();
      console.log(`Updated item ${id} with new quantity: ${qty}`);
      res.json(item);
    } else {
      console.log(`Item with id ${id} not found`);
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error updating item quantity:', error);
    res.status(500).json({ error: 'Failed to update item quantity' });
  }
});


module.exports = router;
