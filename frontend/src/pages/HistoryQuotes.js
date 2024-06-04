// frontend/src/pages/HistoryQuotes.js
import React, { useEffect, useState } from 'react';
import { getQuotes } from '../api';
import '../App.css';  // Ensure you have your global CSS file

const HistoryQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuotes, setFilteredQuotes] = useState([]);

  useEffect(() => {
    getQuotes().then(response => {
      setQuotes(response.data);
      setFilteredQuotes(response.data);
    }).catch(error => {
      console.error('Error fetching quotes:', error);
    });
  }, []);

  useEffect(() => {
    setFilteredQuotes(
      quotes.filter(quote =>
        (quote.name && quote.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (quote.description && quote.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  }, [searchQuery, quotes]);

  return (
    <div className="history-quotes-container">
      <h1>Quote History</h1>
      <input
        type="text"
        placeholder="Search by name or description"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      {filteredQuotes.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Date</th>
              <th>Total Cost</th>
              <th>Price with Markup</th>
              <th>Margin</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.map(quote => (
              <tr key={quote.id}>
                <td>{quote.name}</td>
                <td>{quote.description}</td>
                <td>{quote.date}</td>
                <td>{quote.totalCost}</td>
                <td>{quote.priceWithMarkup}</td>
                <td>{quote.margin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No quotes found</p>
      )}
    </div>
  );
};

export default HistoryQuotes;
