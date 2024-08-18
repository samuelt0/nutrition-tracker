import axios from 'axios';

const APP_ID = process.env.REACT_APP_APP_ID;
const APP_KEY = process.env.REACT_APP_APP_KEY;

export const fetchNutritionData = async (barcode) => {
  const url = `https://api.edamam.com/api/food-database/v2/parser?upc=${barcode}&app_id=${APP_ID}&app_key=${APP_KEY}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching nutrition data', error);
    return null;
  } 
};

