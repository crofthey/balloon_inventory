import React, { useState, useEffect } from 'react';
import { getItems, addQuote } from '../api';
import '../App.css';

const QuoteForm = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [laborCost, setLaborCost] = useState(0);
  const [margin, setMargin] = useState(0);
  const [isMarginPercentage, setIsMarginPercentage] = useState(true);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    getItems().then(response => {
      setItems(response.data);
    }).catch(error => {
      console.error('Error fetching items:', error);
    });
  }, []);

  const handleItemChange = (id, qty) => {
    setSelectedItems({
      ...selectedItems,
      [id]: qty
    });
  };

  const calculateTotalPrice = () => {
    const itemTotal = items.reduce((total, item) => {
      const qty = selectedItems[item.id] || 0;
      return total + (item.unit_cost * qty);
    }, 0);
    const laborTotal = parseFloat(laborCost);
    const costTotal = itemTotal + laborTotal;
    const marginAmount = isMarginPercentage ? (costTotal * (parseFloat(margin) / 100)) : parseFloat(margin);
    return costTotal + marginAmount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalPrice = calculateTotalPrice();
    const quoteReference = `QUOTE-${Date.now()}`;
    const quote = {
      reference: quoteReference,
      description,
      items: selectedItems,
      laborCost,
      margin,
      isMarginPercentage,
      date,
      totalPrice
    };

    try {
      const response = await addQuote(quote);
      setMessage('Quote created successfully!');
      setMessageType('success');
    } catch (error) {
      setMessage('Error creating quote.');
      setMessageType('error');
    }
  };

  return (
    <div className="quote-form-container">
      <h1>Create Quote</h1>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="description">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <label htmlFor="date">Date</label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />

        {items.map(item => (
          <div key={item.id} className="item">
            <span>{item.name} (In stock: {item.qty})</span>
            <input
              type="number"
              min="0"
              value={selectedItems[item.id] || ''}
              onChange={(e) => handleItemChange(item.id, parseInt(e.target.value, 10))}
              placeholder="Quantity"
            />
          </div>
        ))}

        <label htmlFor="laborCost">Labor Cost</label>
        <input
          type="number"
          id="laborCost"
          value={laborCost}
          onChange={(e) => setLaborCost(parseFloat(e.target.value))}
        />

        <label htmlFor="margin">Margin</label>
        <input
          type="number"
          id="margin"
          value={margin}
          onChange={(e) => setMargin(parseFloat(e.target.value))}
        />
        <label>
          <input
            type="radio"
            name="marginType"
            checked={isMarginPercentage}
            onChange={() => setIsMarginPercentage(true)}
          />
          Percentage
        </label>
        <label>
          <input
            type="radio"
            name="marginType"
            checked={!isMarginPercentage}
            onChange={() => setIsMarginPercentage(false)}
          />
          Fixed Amount
        </label>

        <button type="submit">Create Quote</button>

        <div className="quote-summary">
          <p>Total Cost: £{calculateTotalPrice()}</p>
        </div>
      </form>
    </div>
  );
};

export default QuoteForm;
