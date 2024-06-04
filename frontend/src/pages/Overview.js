import React, { useEffect, useState } from 'react';
import { getItems, updateItemQuantity, updateItemCost, deleteItem } from '../api';
import '../App.css';  // Import the CSS file

const Overview = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [newQty, setNewQty] = useState(0);
  const [newCost, setNewCost] = useState(0);
  const [editType, setEditType] = useState(''); // 'quantity' or 'cost'

  useEffect(() => {
    getItems().then(response => {
      console.log('API Response:', response.data);
      setItems(response.data);
      setFilteredItems(response.data);
    }).catch(error => {
      console.error('Error fetching items:', error);
    });
  }, []);

  useEffect(() => {
    setFilteredItems(
      items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.color.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, items]);

  const handleEditClick = (id, currentQty, currentCost, type) => {
    setEditingItemId(id);
    setEditType(type);
    if (type === 'quantity') {
      setNewQty(currentQty);
    } else if (type === 'cost') {
      setNewCost(currentCost);
    }
  };

  const handleSaveClick = async (id) => {
    try {
      if (editType === 'quantity') {
        const updatedItem = await updateItemQuantity(id, newQty);
        setItems(items.map(item => item.id === id ? updatedItem.data : item));
      } else if (editType === 'cost') {
        const updatedItem = await updateItemCost(id, newCost);
        setItems(items.map(item => item.id === id ? updatedItem.data : item));
      }
      setEditingItemId(null);
      setEditType('');
    } catch (error) {
      console.error(`Error updating item ${editType}:`, error);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be reversed.')) {
      try {
        await deleteItem(id);
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <div className="overview-container">
      <h1>Inventory Overview</h1>
      <input
        type="text"
        placeholder="Search by name, manufacturer, or color"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      {filteredItems.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Manufacturer</th>
              <th>Colour</th>
              <th>Quantity</th>
              <th>Unit Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.manufacturer}</td>
                <td>{item.color}</td>
                <td>
                  {editingItemId === item.id && editType === 'quantity' ? (
                    <input
                      type="number"
                      value={newQty}
                      onChange={(e) => setNewQty(e.target.value)}
                    />
                  ) : (
                    item.qty
                  )}
                </td>
                <td>
                  {editingItemId === item.id && editType === 'cost' ? (
                    <input
                      type="number"
                      value={newCost}
                      onChange={(e) => setNewCost(e.target.value)}
                    />
                  ) : (
                    item.unit_cost
                  )}
                </td>
                <td>
                  {editingItemId === item.id ? (
                    <button onClick={() => handleSaveClick(item.id)}>Save</button>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(item.id, item.qty, item.unit_cost, 'quantity')}>Edit Qty</button>
                      <button onClick={() => handleEditClick(item.id, item.qty, item.unit_cost, 'cost')}>Update Cost</button>
                      <button onClick={() => handleDeleteItem(item.id)}>Delete Item</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No items found</p>
      )}
    </div>
  );
};

export default Overview;
