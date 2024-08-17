//import logo from './logo.svg';
import './App.css';
import React from 'react';
import BarcodeUploader from './app/routes/BarcodeUploader';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FoodSearch from './app/routes/FoodSearch';
import FoodPhoto from './app/routes/FoodPhoto';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/barcode" element={<BarcodeUploader />} />
        <Route path="/search" element={<FoodSearch />} />
        <Route path="/photo" element={<FoodPhoto />} />
      </Routes>
    </Router>
  );
}





export default App;
