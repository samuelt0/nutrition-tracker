import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleViewTracker = () => {
    navigate('/tracker');
  };

  return (
    <div>
      <h1>Welcome to the Food Tracker App</h1>
      <nav>
      </nav>
      <button onClick={handleViewTracker}>View Daily Food Tracker</button>
    </div>
  );
};

export default LandingPage;
