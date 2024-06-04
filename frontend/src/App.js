// frontend/src/App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Overview from './pages/Overview';
import AddStock from './pages/AddStock';
import UseStock from './pages/UseStock';
import History from './pages/History';
import Navbar from './components/Navbar';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/add-stock" element={<AddStock />} />
        <Route path="/use-stock" element={<UseStock />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </div>
  );
};

export default App;
