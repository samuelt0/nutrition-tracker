import React, { useState } from 'react';
import axios from 'axios';
import './FoodSearch.css';
import DailyFoodTracker from '../../components/DailyFoodTracker';

const FoodSearch = () => {
  const [query, setQuery] = useState('');
  const [nutrition, setNutrition] = useState(null);
  const [foodName, setFoodName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [trackerVisible, setTrackerVisible] = useState(false);

  const fetchNutritionData = async (query) => {
    const APP_ID = process.env.REACT_APP_APP_ID;
    const APP_KEY = process.env.REACT_APP_APP_KEY;
    const url = `https://api.edamam.com/api/food-database/v2/parser?ingr=${encodeURIComponent(query)}&app_id=${APP_ID}&app_key=${APP_KEY}`;

    console.log('Fetching nutrition data from URL:', url);

    try {
      setLoading(true);
      const response = await axios.get(url);
      setLoading(false);

      if (response.data && response.data.hints && response.data.hints.length > 0) {
        const food = response.data.hints[0].food || {};
        const nutrients = food.nutrients || {};
        console.log('Nutrients:', nutrients.FAT);

        const formatValue = (value) => {
          const roundedValue = value ? parseFloat(value).toFixed(2) : 0;
          return roundedValue === '0.00' ? 0 : roundedValue;
        };

        setFoodName(food.label);
        return {
          calories: formatValue(nutrients.ENERC_KCAL),
          protein: formatValue(nutrients.PROCNT),
          carbs: formatValue(nutrients.CHOCDF),
          fats: formatValue(nutrients.FAT),
          sugar: formatValue(nutrients.SUGAR),
          cholesterol: formatValue(nutrients.CHOLE),
        };
      } else {
        setError('No nutrition data found for this food item.');
        return null;
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching nutrition data', error);
      setError('Failed to fetch nutrition data');
      return null;
    }
  };

  const handleSearch = async () => {
    setError('');
    setNutrition(null);
    setFoodName('');
    setModalVisible(false);

    if (!query.trim()) {
      setError('Please enter a food item');
      setModalVisible(true);
      return;
    }

    const nutritionData = await fetchNutritionData(query);
    setNutrition(nutritionData);
  };

  const handleAddToTracker = () => {
    if (nutrition) {
      setTrackerVisible(true);
    }
  };

  return (
    <div className="container">
      <h3>Search for Food</h3>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter food item"
      />
      <button onClick={handleSearch}>Search</button>
      {foodName && <h4>Food: {foodName}</h4>}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {nutrition && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Nutrient</th>
                <th>Amount</th>
                <th>Units</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Calories</td>
                <td>{nutrition.calories}</td>
                <td>kcal</td>
              </tr>
              <tr>
                <td>Protein</td>
                <td>{nutrition.protein}</td>
                <td>g</td>
              </tr>
              <tr>
                <td>Carbohydrates</td>
                <td>{nutrition.carbs}</td>
                <td>g</td>
              </tr>
              <tr>
                <td>Fats</td>
                <td>{nutrition.fats}</td>
                <td>g</td>
              </tr>
              <tr>
                <td>Sugar</td>
                <td>{nutrition.sugar}</td>
                <td>g</td>
              </tr>
              <tr>
                <td>Cholesterol</td>
                <td>{nutrition.cholesterol}</td>
                <td>mg</td>
              </tr>
            </tbody>
          </table>
          <button className="add-to-tracker-button" onClick={handleAddToTracker}>
            Add to Tracker
          </button>
        </div>
      )}
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="modal-close" onClick={() => setModalVisible(false)}>&times;</span>
            <p>{error}</p>
          </div>
        </div>
      )}
      {trackerVisible && (
        <DailyFoodTracker
          nutrition={nutrition}
          foodName={foodName}
          onClose={() => setTrackerVisible(false)}
        />
      )}
    </div>
  );
};

export default FoodSearch;
