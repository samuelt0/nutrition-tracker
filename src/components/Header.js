import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav-link">
          <img src="src/assets/home.svg" alt="Home" className="nav-icon" />
          Home
        </Link>
        <Link to="/photo" className="nav-link">
          <img src="src/assets/camera.svg" alt="FoodImg" className="nav-icon" />
          Photo
        </Link>
        <Link to="/barcode" className="nav-link">
          <img src="src/assets/barcode.png" alt="Barcode" className="nav-icon" />
          Barcode
        </Link>
        <Link to="/search" className="nav-link">
          <img src="src/assets/search.svg" alt="Search" className="nav-icon" />
          Search
        </Link>
      </nav>
    </header>
  );
};

export default Header;
