const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');

// Fetch all quotes
router.get('/', async (req, res) => {
  try {
    console.log('Received GET request for /api/quotes');
    const quotes = await Quote.findAll();
    console.log('Fetched quotes:', JSON.stringify(quotes, null, 2));
    res.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// Add a new quote
router.post('/add', async (req, res) => {
  try {
    console.log('Received POST request for /api/quotes/add');
    console.log('Request body:', req.body);
    const quote = await Quote.create(req.body);
    console.log('Created quote:', quote);
    res.json(quote);
  } catch (error) {
    console.error('Error adding quote:', error);
    res.status(500).json({ error: 'Failed to add quote' });
  }
});

// Update an existing quote
router.put('/update/:id', async (req, res) => {
  try {
    console.log('Received PUT request for /api/quotes/update/' + req.params.id);
    console.log('Request body:', req.body);
    const quote = await Quote.findByPk(req.params.id);
    if (!quote) {
      console.error('Quote not found');
      return res.status(404).json({ error: 'Quote not found' });
    }
    console.log('Found quote:', JSON.stringify(quote, null, 2));
    await quote.update(req.body);
    console.log('Updated quote:', JSON.stringify(quote, null, 2));
    res.json(quote);
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({ error: 'Failed to update quote' });
  }
});

// Convert a quote to a booking
router.post('/convert-to-booking/:id', async (req, res) => {
  try {
    console.log('Received POST request for /api/quotes/convert-to-booking/' + req.params.id);
    console.log('Request body:', req.body);
    const quote = await Quote.findByPk(req.params.id);
    if (!quote) {
      console.error('Quote not found');
      return res.status(404).json({ error: 'Quote not found' });
    }
    console.log('Found quote:', JSON.stringify(quote, null, 2));
    // Assuming you have a Booking model
    const booking = await Booking.create({
      ...req.body,
      quoteId: quote.id,
      items: quote.items,
      totalCost: quote.totalCost,
      priceWithMarkup: quote.priceWithMarkup,
      margin: quote.margin,
    });
    console.log('Created booking:', booking);
    res.json(booking);
  } catch (error) {
    console.error('Error converting quote to booking:', error);
    res.status(500).json({ error: 'Failed to convert quote to booking' });
  }
});

module.exports = router;
