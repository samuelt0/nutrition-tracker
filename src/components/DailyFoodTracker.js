import React, { useState } from 'react';
import axios from 'axios';
import './DailyFoodTracker.css';

const DailyFoodTracker = ({ nutrition, foodName, onClose }) => {
  const [mealType, setMealType] = useState('breakfast');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddToTracker = async () => {
    if (!nutrition) {
      setError('No nutrition data available to add');
      return;
    }

    // Ensure all nutrition fields are numbers and set default values if undefined
    const multipliedNutrition = {
      calories: (Number(nutrition.calories) || 0) * quantity,
      protein: (Number(nutrition.protein) || 0) * quantity,
      carbohydrates: (Number(nutrition.carbs) || 0) * quantity,
      fats: (Number(nutrition.fats) || 0) * quantity,
      sugar: (Number(nutrition.sugar) || 0) * quantity,
      cholesterol: (Number(nutrition.cholesterol) || 0) * quantity,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/fooditems', {
        name: foodName,
        mealType,
        quantity,
        calories: multipliedNutrition.calories,
        protein: multipliedNutrition.protein,
        fats: multipliedNutrition.fats,
        carbohydrates: multipliedNutrition.carbs,
        sugar: multipliedNutrition.sugar,
        cholesterol: multipliedNutrition.cholesterol,
        totalMacros: multipliedNutrition.calories + multipliedNutrition.protein + multipliedNutrition.fats + multipliedNutrition.carbs + multipliedNutrition.sugar + multipliedNutrition.cholesterol,
      });
      
      if (response.status === 200) {
        setSuccessMessage('Food item successfully added to your tracker!');
      } else {
        setError('Failed to add food item to tracker');
      }
    } catch (error) {
      console.error('Error adding to tracker', error);
      setError('Failed to add food item to tracker');
    }
  };

  return (
    <div className="tracker-modal">
      <div className="tracker-modal-content">
        <span className="tracker-modal-close" onClick={onClose}>&times;</span>
        <h3>Add to Daily Tracker</h3>
        <p><strong>Food:</strong> {foodName}</p>
        <p><strong>Nutrients:</strong></p>
        <ul>
          <li>Calories: {nutrition ? (nutrition.calories * quantity).toFixed(2) : 0} kcal</li>
          <li>Protein: {nutrition ? (nutrition.protein * quantity).toFixed(2) : 0} g</li>
          <li>Carbs: {nutrition ? (nutrition.carbs * quantity).toFixed(2) : 0} g</li>
          <li>Fats: {nutrition ? (nutrition.fats * quantity).toFixed(2) : 0} g</li>
          <li>Sugar: {nutrition ? (nutrition.sugar * quantity).toFixed(2) : 0} g</li>
          <li>Cholesterol: {nutrition ? (nutrition.cholesterol * quantity).toFixed(2) : 0} mg</li>
        </ul>
        <label htmlFor="mealType">Meal Type:</label>
        <select id="mealType" value={mealType} onChange={(e) => setMealType(e.target.value)}>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <button onClick={handleAddToTracker}>Add to Tracker</button>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default DailyFoodTracker;
