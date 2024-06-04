// frontend/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png'; // Ensure you have your logo in the assets folder

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Overview</Link></li>
        <li><Link to="/add-stock">Add Stock</Link></li>
        <li><Link to="/use-stock">Allocate Stock</Link></li>
	<li><Link to="/history">History</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
