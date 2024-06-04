import React, { useEffect, useState } from 'react';
import { getItems, updateItemQuantity } from '../api';
import './Overview.css';  // Import the CSS file

const Overview = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [newQty, setNewQty] = useState(0);

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

  const handleEditClick = (id, currentQty) => {
    setEditingItemId(id);
    setNewQty(currentQty);
  };

  const handleSaveClick = async (id) => {
    try {
      const updatedItem = await updateItemQuantity(id, newQty);
      setItems(items.map(item => item.id === id ? updatedItem.data : item));
      setEditingItemId(null);
    } catch (error) {
      console.error('Error updating item quantity:', error);
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
              <th>Color</th>
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
                  {editingItemId === item.id ? (
                    <input
                      type="number"
                      value={newQty}
                      onChange={(e) => setNewQty(e.target.value)}
                    />
                  ) : (
                    item.qty
                  )}
                </td>
                <td>{item.unit_cost}</td>
                <td>
                  {editingItemId === item.id ? (
                    <button onClick={() => handleSaveClick(item.id)}>Save</button>
                  ) : (
                    <button onClick={() => handleEditClick(item.id, item.qty)}>Edit</button>
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
