import React, { useState } from 'react';
import { addItem } from '../api';
import '../App.css';  // Import the CSS file

const AddStock = () => {
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    color: '',
    qty: '',
    unit_cost: '',
    barcode: ''
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addItem(formData);
      setMessage('Item added successfully!');
      setMessageType('success');
      console.log('Item added', response.data);
      setFormData({
        name: '',
        manufacturer: '',
        color: '',
        qty: '',
        unit_cost: '',
        barcode: ''
      });
    } catch (error) {
      setMessage('Error adding item.');
      setMessageType('error');
      console.error('Error adding item', error);
    }
  };

  return (
    <div className="add-stock-container">
      <h1>Add Stock</h1>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        </label>
        <label>
          Manufacturer:
          <input name="manufacturer" value={formData.manufacturer} onChange={handleChange} placeholder="Manufacturer" />
        </label>
        <label>
          Colour:
          <input name="color" value={formData.color} onChange={handleChange} placeholder="Colour" />
        </label>
        <label>
          Quantity:
          <input name="qty" value={formData.qty} onChange={handleChange} placeholder="Quantity" type="number" required />
        </label>
        <label>
          Unit Cost:
          <input name="unit_cost" value={formData.unit_cost} onChange={handleChange} placeholder="Unit Cost" type="number" step="0.01" required />
        </label>
        <label>
          Barcode:
          <input name="barcode" value={formData.barcode} onChange={handleChange} placeholder="Barcode" required />
        </label>
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default AddStock;
