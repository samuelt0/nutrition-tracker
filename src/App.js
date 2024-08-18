import './App.css';
import React from 'react';
import BarcodeUploader from './app/routes/BarcodeUploader';
import FoodSearch from './app/routes/FoodSearch';
import FoodPhoto from './app/routes/FoodPhoto';
import LandingPage from './app/routes/LandingPage';
import NotFound from './app/routes/NotFound';
import DailyFoodTracker from './components/DailyFoodTracker';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Header /> 
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/barcode" element={<BarcodeUploader />} />
          <Route path="/search" element={<FoodSearch />} />
          <Route path="/photo" element={<FoodPhoto />} />
          <Route path="/dailytracker" element={<DailyFoodTracker />} /> 
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
