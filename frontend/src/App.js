// frontend/src/App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Overview from './pages/Overview';
import AddStock from './pages/AddStock';
import UseStock from './pages/UseStock';
import History from './pages/History';
import QuoteForm from './pages/QuoteForm';
import HistoryQuotes from './pages/HistoryQuotes';
import ViewQuotes from './pages/ViewQuotes';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/quote" element={<QuoteForm />} />
        <Route path="/add-stock" element={<AddStock />} />
        <Route path="/use-stock" element={<UseStock />} />
        <Route path="/history" element={<History />} />
        <Route path="/history-quotes" element={<HistoryQuotes />} />
        <Route path="/view-quotes" element={<ViewQuotes />} />
      </Routes>
    </div>
  );
};

export default App;
