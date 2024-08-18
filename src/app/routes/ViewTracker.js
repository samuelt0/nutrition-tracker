import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './ViewTracker.css';

const ViewTracker = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    fats: 0,
    carbohydrates: 0,
    sugar: 0,
    cholesterol: 0,
  });

  const fetchFoodItems = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/fooditems');
      const items = response.data;
      setFoodItems(items);
      calculateTotals(items);
    } catch (error) {
      console.error('Error fetching food items:', error);
      alert('Failed to fetch food items.');
    }
  }, []);

  useEffect(() => {
    fetchFoodItems();
  }, [fetchFoodItems]);

  const calculateTotals = (items) => {
    const totals = items.reduce(
      (acc, item) => {
        acc.calories += item.calories * item.quantity;
        acc.protein += item.protein * item.quantity;
        acc.fats += item.fat * item.quantity;
        acc.carbohydrates += item.carbohydrates * item.quantity;
        acc.sugar += item.sugar * item.quantity;
        acc.cholesterol += item.cholesterol * item.quantity;
        return acc;
      },
      { calories: 0, protein: 0, fats: 0, carbohydrates: 0, sugar: 0, cholesterol: 0 }
    );
    
    setTotals({
      calories: totals.calories.toFixed(2),
      protein: totals.protein.toFixed(2),
      fats: totals.fats.toFixed(2),
      carbohydrates: totals.carbohydrates.toFixed(2),
      sugar: totals.sugar.toFixed(2),
      cholesterol: totals.cholesterol.toFixed(2),
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/fooditems/${id}`);
      fetchFoodItems();
    } catch (error) {
      console.error('Error deleting food item:', error);
      alert('Failed to delete food item.');
    }
  };

  const renderMealType = (mealType) => {
    const filteredItems = foodItems.filter(item => item.mealtime === mealType);
    console.log(`Rendering ${mealType} meal type with items:`, filteredItems); // Debugging line
    if (filteredItems.length === 0) return null;

    return (
      <div className="meal-section" key={mealType}>
        <h2>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h2>
        <ul>
          {filteredItems.map((item) => (
            <li key={item.id}>
              <span>{item.name}</span>
              <span>{(item.calories * item.quantity).toFixed(2)} calories, {(item.protein * item.quantity).toFixed(2)}g protein, {(item.fat * item.quantity).toFixed(2)}g fats, {(item.carbohydrates * item.quantity).toFixed(2)}g carbohydrates, {(item.sugar * item.quantity).toFixed(2)}g sugar, {(item.cholesterol * item.quantity).toFixed(2)}mg cholesterol</span>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="view-tracker-container">
      <h1>Daily Food Tracker</h1>
      <div className="totals">
        <h3>Total Nutrients for Today</h3>
        <p>Calories: {totals.calories} kcal</p>
        <p>Protein: {totals.protein} g</p>
        <p>Fats: {totals.fats} g</p>
        <p>Carbohydrates: {totals.carbohydrates} g</p>
        <p>Sugar: {totals.sugar} g</p>
        <p>Cholesterol: {totals.cholesterol} mg</p>
      </div>
      <div className="meals-container">
        {renderMealType('breakfast')}
        {renderMealType('lunch')}
        {renderMealType('dinner')}
        {renderMealType('snack')}
      </div>
    </div>
  );
};

export default ViewTracker;
