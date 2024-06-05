import React, { useState, useEffect } from 'react';
import { getItems, getQuotes, updateQuote } from '../api';
import { Modal, Button, Form } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const formatDate = (isoDate) => {
  return format(parseISO(isoDate), 'yyyy-MM-dd');
};

const ViewQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchQuotes();
    fetchItems();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await getQuotes();
      setQuotes(response.data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await getItems();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleEditClick = (quote) => {
    setSelectedQuote({
      ...quote,
      date: formatDate(quote.date),
      items: JSON.parse(quote.items)
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedQuote(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedQuote({ ...selectedQuote, [name]: value });
  };

  const handleItemChange = (id, qty) => {
    const updatedItems = { ...selectedQuote.items, [id]: qty };
    setSelectedQuote({ ...selectedQuote, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting quote:', selectedQuote); // Debug log
    if (selectedQuote && selectedQuote.id) {
      try {
        const response = await updateQuote({ ...selectedQuote, items: JSON.stringify(selectedQuote.items) });
        console.log('Update response:', response); // Debug log
        fetchQuotes(); // Fetch updated quotes
        handleModalClose();
      } catch (error) {
        console.error('Error updating quote:', error);
      }
    } else {
      console.error('Error: selectedQuote or selectedQuote.id is undefined');
    }
  };

  return (
    <div className="view-quotes-container">
      <h1>View Quotes</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Date</th>
            <th>Total Cost</th>
            <th>Price</th>
            <th>Profit</th>
            <th>Items</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => {
            const parsedItems = JSON.parse(quote.items);
            return (
              <tr key={quote.id}>
                <td>{quote.name}</td>
                <td>{quote.description}</td>
                <td>{format(new Date(quote.date), 'dd-MM-yyyy')}</td>
                <td>£{Number(quote.totalCost).toFixed(2)}</td>
                <td>£{Number(quote.price).toFixed(2)}</td>
                <td>£{Number(quote.profit).toFixed(2)}</td>
                <td>
                  {Object.entries(parsedItems)
                    .filter(([itemId, qty]) => qty > 0)
                    .map(([itemId, qty]) => {
                      const item = items.find(item => item.id.toString() === itemId);
                      return (
                        item ? <div key={itemId}>{`${item.name}: ${qty}`}</div> : null
                      );
                    })}
                </td>
                <td>
                  <button onClick={() => handleEditClick(quote)}>Edit</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedQuote && (
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Quote</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={selectedQuote.name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={selectedQuote.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={selectedQuote.date}
                  onChange={handleInputChange}
                />
              </Form.Group>

              {items.map((item) => (
                <Form.Group key={item.id} controlId={`formItem${item.id}`}>
                  <Form.Label>{item.name} (In stock: {item.qty})</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={selectedQuote.items[item.id] || ''}
                    onChange={(e) => handleItemChange(item.id, parseInt(e.target.value, 10))}
                    placeholder="Quantity"
                  />
                </Form.Group>
              ))}

              <Form.Group controlId="formLaborCost">
                <Form.Label>Labor Cost</Form.Label>
                <Form.Control
                  type="number"
                  name="laborCost"
                  value={selectedQuote.laborCost}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formMargin">
                <Form.Label>Margin</Form.Label>
                <Form.Control
                  type="number"
                  name="margin"
                  value={selectedQuote.margin}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Check
                type="radio"
                label="Percentage"
                name="isMarginPercentage"
                checked={selectedQuote.isMarginPercentage}
                onChange={() => setSelectedQuote({ ...selectedQuote, isMarginPercentage: true })}
              />
              <Form.Check
                type="radio"
                label="Fixed Amount"
                name="isMarginPercentage"
                checked={!selectedQuote.isMarginPercentage}
                onChange={() => setSelectedQuote({ ...selectedQuote, isMarginPercentage: false })}
              />
              <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  Save changes
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default ViewQuotes;
