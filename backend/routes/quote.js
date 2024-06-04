// backend/routes/quote.js
const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');

router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.findAll();
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

router.post('/add', async (req, res) => {
  try {
    const quote = await Quote.create(req.body);
    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add quote' });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id);
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    await quote.update(req.body);
    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quote' });
  }
});

router.post('/convert-to-booking/:id', async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id);
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    // Assuming you have a Booking model
    const booking = await Booking.create({
      ...req.body,
      quoteId: quote.id,
      items: quote.items,
      totalCost: quote.totalCost,
      priceWithMarkup: quote.priceWithMarkup,
      margin: quote.margin,
    });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to convert quote to booking' });
  }
});

module.exports = router;
