//import logo from './logo.svg';
import './App.css';
import React from 'react';
import BarcodeUploader from './app/routes/BarcodeUploader';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FoodSearch from './app/routes/FoodSearch';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/barcode" element={<BarcodeUploader />} />
        <Route path="/search" element={<FoodSearch />} />
      </Routes>
    </Router>
  );
}





export default App;
