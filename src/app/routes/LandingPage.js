import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleViewTracker = () => {
    navigate('/tracker');
  };

  return (
    <div>
      <h1 style={{ marginTop: '-200px' }}>Welcome to the NutriTracker App</h1>
      <nav>
      </nav>
      <button onClick={handleViewTracker}>View Food Tracker</button>
    </div>
  );
};

export default LandingPage;
