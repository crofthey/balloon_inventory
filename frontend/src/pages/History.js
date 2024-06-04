import React, { useEffect, useState } from 'react';
import { getAllocations } from '../api';
import './History.css';  // Import the CSS file

const History = () => {
  const [allocations, setAllocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAllocations, setFilteredAllocations] = useState([]);

  useEffect(() => {
    getAllocations().then(response => {
      console.log('API Response:', response.data);
      const parsedAllocations = response.data.map(allocation => ({
        ...allocation,
        items: JSON.parse(allocation.items)
      }));
      setAllocations(parsedAllocations);
      setFilteredAllocations(parsedAllocations);
    }).catch(error => {
      console.error('Error fetching allocations:', error);
    });
  }, []);

  useEffect(() => {
    setFilteredAllocations(
      allocations.filter(allocation =>
        allocation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        allocation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        allocation.items.some(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    );
  }, [searchQuery, allocations]);

  return (
    <div className="history-container">
      <h1>Historical Orders</h1>
      <input
        type="text"
        placeholder="Search by name, description, or item"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      {filteredAllocations.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Date</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {filteredAllocations.map(allocation => (
              <tr key={allocation.id}>
                <td>{allocation.name}</td>
                <td>{allocation.description}</td>
                <td>{new Date(allocation.date).toLocaleString()}</td>
                <td>
                  <ul>
                    {allocation.items.map(item => (
                      <li key={item.id}>{item.name} (Qty: {item.qty})</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No historical orders found</p>
      )}
    </div>
  );
};

export default History;
