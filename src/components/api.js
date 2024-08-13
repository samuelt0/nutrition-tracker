import axios from 'axios';

const APP_ID = 'e2cd24d8';
const APP_KEY = 'b90cf2c69f6cccaf4e452b75907d1141';

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

