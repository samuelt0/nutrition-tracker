import React, { useState } from 'react';
import axios from 'axios';
import './DailyFoodTracker.css';

const DailyFoodTracker = ({ nutrition, foodName, onClose }) => {
  const [mealType, setMealType] = useState('breakfast');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setQuantity(''); // Allow the field to be empty
    } else {
      const number = Number(value);
      if (!isNaN(number) && number > 0) {
        setQuantity(number);
      } else {
        setQuantity(1); // Reset to 1 if an invalid number is entered
      }
    }
  };

  const handleAddToTracker = async () => {
    if (!nutrition) {
      setError('No nutrition data available to add');
      return;
    }

    const multipliedNutrition = {
      calories: (Number(nutrition.calories) || 0) * (quantity || 1),
      protein: (Number(nutrition.protein) || 0) * (quantity || 1),
      carbohydrates: (Number(nutrition.carbs) || 0) * (quantity || 1),
      fats: (Number(nutrition.fats) || 0) * (quantity || 1),
      sugar: (Number(nutrition.sugar) || 0) * (quantity || 1),
      cholesterol: (Number(nutrition.cholesterol) || 0) * (quantity || 1),
    };

    try {
      const response = await axios.post('http://localhost:8080/api/fooditems', {
        name: foodName,
        mealtime: mealType, // Changed to mealtime
        quantity: quantity,
        calories: multipliedNutrition.calories,
        protein: multipliedNutrition.protein,
        fat: multipliedNutrition.fats,
        carbohydrates: multipliedNutrition.carbohydrates,
        sugar: multipliedNutrition.sugar,
        cholesterol: multipliedNutrition.cholesterol,
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
          <li>Calories: {nutrition ? (nutrition.calories * (quantity || 1)).toFixed(2) : 0} kcal</li>
          <li>Protein: {nutrition ? (nutrition.protein * (quantity || 1)).toFixed(2) : 0} g</li>
          <li>Carbs: {nutrition ? (nutrition.carbs * (quantity || 1)).toFixed(2) : 0} g</li>
          <li>Fats: {nutrition ? (nutrition.fats * (quantity || 1)).toFixed(2) : 0} g</li>
          <li>Sugar: {nutrition ? (nutrition.sugar * (quantity || 1)).toFixed(2) : 0} g</li>
          <li>Cholesterol: {nutrition ? (nutrition.cholesterol * (quantity || 1)).toFixed(2) : 0} mg</li>
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
          onChange={handleQuantityChange}
        />
        <button onClick={handleAddToTracker}>Add to Tracker</button>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default DailyFoodTracker;
