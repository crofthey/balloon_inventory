import React, { useEffect, useState } from 'react';
import { getItems, submitItemsUsage } from '../api';
import './UseStock.css';  // Import the CSS file

const UseStock = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    getItems().then(response => {
      console.log('API Response:', response.data);
      setItems(response.data);
    }).catch(error => {
      console.error('Error fetching items:', error);
    });
  }, []);

  const handleChange = (id, qty) => {
    setSelectedItems({
      ...selectedItems,
      [id]: qty
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemsToUse = Object.entries(selectedItems)
      .filter(([id, qty]) => qty > 0)
      .map(([id, qty]) => ({ id, qty }));

    if (itemsToUse.length === 0) {
      setMessage('Please select at least one item to use.');
      setMessageType('error');
      return;
    }

    try {
      const response = await submitItemsUsage(name, description, itemsToUse);
      setMessage('Items used successfully!');
      setMessageType('success');
      console.log('Items used', response.data);
      setSelectedItems({});
      setName('');
      setDescription('');
    } catch (error) {
      setMessage('Error using items.');
      setMessageType('error');
      console.error('Error using items', error);
    }
  };

  return (
    <div className="use-stock-container">
      <h1>Use Stock</h1>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            required
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
          />
        </label>
        {items.length > 0 ? (
          items.map(item => (
            <div key={item.id} className="item">
              <span>{item.name} (Current Stock: {item.qty})</span>
              <input
                type="number"
                min="0"
                value={selectedItems[item.id] || ''}
                onChange={e => handleChange(item.id, parseInt(e.target.value, 10))}
                placeholder="Quantity"
              />
            </div>
          ))
        ) : (
          <p>No items available</p>
        )}
        <button type="submit">Use Items</button>
      </form>
    </div>
  );
};

export default UseStock;
