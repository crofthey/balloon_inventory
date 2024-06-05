// frontend/src/pages/ViewQuotes.js
import React, { useEffect, useState } from 'react';
import { getQuotes, updateQuote, convertQuoteToBooking } from '../api';
import { format, parseISO } from 'date-fns'; // Ensure correct import
import '../App.css';  // Create and use a CSS file for styling

// Define the formatDate function
const formatDate = (isoDate) => {
  return format(new Date(isoDate), 'dd-MM-yyyy');
};

const ViewQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [editingQuoteId, setEditingQuoteId] = useState(null);
  const [quoteDetails, setQuoteDetails] = useState({
    name: '',
    description: '',
    date: '',
    laborCost: 0,
    markup: 0,
    totalCost: 0,
    priceWithMarkup: 0,
    margin: 0,
  });

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

  const handleEditClick = (quote) => {
    setEditingQuoteId(quote.id);
    setQuoteDetails({
      ...quote,
      date: format(parseISO(quote.date), 'yyyy-MM-dd'), // Format for input field
    });
  };

  const handleSaveClick = async (id) => {
    try {
      const updatedQuote = await updateQuote(id, quoteDetails);
      setQuotes(quotes.map(quote => quote.id === id ? updatedQuote.data : quote));
      setEditingQuoteId(null);
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  };

  const handleConvertToBookingClick = async (id) => {
    try {
      const bookingDetails = {
        customerName: '',
        customerEmail: '',
        delivery: false,
        depositPaid: false,
        balanceCleared: false,
        bookingDate: ''
      };
      await convertQuoteToBooking(id, bookingDetails);
    } catch (error) {
      console.error('Error converting quote to booking:', error);
    }
  };

  return (
    <div className="view-quotes-container">
      <h1>View Quotes</h1>
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
              <th>Quote id</th>
              <th>Name</th>
              <th>Description</th>
              <th>Delivery Date</th>
              <th>Total Cost</th>
              <th>Price</th>
              <th>Profit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.map(quote => (
              <tr key={quote.id}>
                <td>{quote.id}</td>
                <td>{quote.name}</td>
                <td>{quote.description}</td>
                <td>{formatDate(quote.date)}</td> {/* Display formatted date */}
                <td>{quote.totalCost}</td>
                <td>{quote.price}</td>
                <td>{quote.profit}</td>
                <td>
                  <button onClick={() => handleEditClick(quote)}>Edit</button>
                  <button onClick={() => handleConvertToBookingClick(quote.id)}>Convert to Booking</button>
                  {editingQuoteId === quote.id && (
                    <div className="edit-quote-form">
                      <input
                        type="text"
                        value={quoteDetails.name}
                        onChange={(e) => setQuoteDetails({ ...quoteDetails, name: e.target.value })}
                      />
                      <textarea
                        value={quoteDetails.description}
                        onChange={(e) => setQuoteDetails({ ...quoteDetails, description: e.target.value })}
                      />
                      <input
                        type="date"
                        value={quoteDetails.date}
                        onChange={(e) => setQuoteDetails({ ...quoteDetails, date: e.target.value })}
                      />
                      <input
                        type="number"
                        value={quoteDetails.laborCost}
                        onChange={(e) => setQuoteDetails({ ...quoteDetails, laborCost: parseFloat(e.target.value) })}
                      />
                      <input
                        type="number"
                        value={quoteDetails.markup}
                        onChange={(e) => setQuoteDetails({ ...quoteDetails, markup: parseFloat(e.target.value) })}
                      />
                      <button onClick={() => handleSaveClick(quote.id)}>Save</button>
                    </div>
                  )}
                </td>
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

export default ViewQuotes;
