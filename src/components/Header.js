import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import homeIcon from '../assets/home.svg';
import photoIcon from '../assets/camera.svg';
import searchIcon from '../assets/search.svg';
import barcodeIcon from '../assets/barcode.png';

const Header = () => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <h1>NutriTracker</h1>
      </div>
      <nav className="navbar-links">
        <Link to="/" className="nav-link">
          <img src={homeIcon} alt="Home" className="nav-icon" />
          Home
        </Link>
        <Link to="/photo" className="nav-link">
          <img src={photoIcon} alt="Cam" className="nav-icon" />
          Photo
        </Link>
        <Link to="/search" className="nav-link">
          <img src={searchIcon} alt="Search" className="nav-icon" />
          Search
        </Link>
        <Link to="/barcode" className="nav-link">
          <img src={barcodeIcon} alt="Barcode" className="nav-icon" />
          Barcode
        </Link>
      </nav>
    </header>
  );
};

export default Header;
