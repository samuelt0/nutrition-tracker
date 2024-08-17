import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { BrowserMultiFormatReader } from '@zxing/library';
import axios from 'axios';
import './BarcodeUploader.css';
import DailyFoodTracker from '../../components/DailyFoodTracker';

const BarcodeUploader = () => {
  const [barcode, setBarcode] = useState('');
  const [nutrition, setNutrition] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [trackerVisible, setTrackerVisible] = useState(false);

  const fetchNutritionData = async (barcode) => {
    const APP_ID = 'e2cd24d8';
    const APP_KEY = 'b90cf2c69f6cccaf4e452b75907d1141';
    const url = `https://api.edamam.com/api/food-database/v2/parser?upc=${barcode}&app_id=${APP_ID}&app_key=${APP_KEY}`;

    console.log('Fetching data from URL:', url);

    try {
      setLoading(true);
      const response = await axios.get(url);
      setLoading(false);

      if (response.data && response.data.hints && response.data.hints.length > 0) {
        const food = response.data.hints[0].food || {};
        const nutrients = food.nutrients || {};
        console.log("Nutrients:", nutrients);

        const formatValue = (value) => {
          const roundedValue = value ? parseFloat(value).toFixed(2) : 0;
          return roundedValue === '0.00' ? 0 : roundedValue;
        };

        setBarcode(food.label || barcode);
        return {
          calories: formatValue(nutrients.ENERC_KCAL),
          protein: formatValue(nutrients.PROCNT),
          carbs: formatValue(nutrients.CHOCDF),
          fats: formatValue(nutrients.FAT),
          sugar: formatValue(nutrients.SUGAR),
          cholesterol: formatValue(nutrients.CHOLE),
        };
      } else {
        setError('No nutrition data found for this barcode.');
        return null;
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching nutrition data', error);
      setError('Failed to fetch nutrition data');
      return null;
    }
  };

  const addToTracker = async (quantity) => {
    try {
      const response = await axios.post('/api/tracker/add', {
        barcode,
        nutrition,
        quantity,
      });

      if (response.status === 200) {
        console.log('Food added to tracker');
        setTrackerVisible(false);
      } else {
        console.error('Failed to add food to tracker');
      }
    } catch (error) {
      console.error('Error adding food to tracker', error);
    }
  };

  const onDrop = (acceptedFiles) => {
    setError('');
    setNutrition(null);

    const file = acceptedFiles[0];
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      setModalVisible(true);
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      setImageSrc(event.target.result);
      const img = new Image();
      img.src = event.target.result;

      img.onload = async () => {
        const codeReader = new BrowserMultiFormatReader();
        try {
          const result = await codeReader.decodeFromImage(img);
          setBarcode(result.text);
          const nutritionData = await fetchNutritionData(result.text);
          setNutrition(nutritionData);
        } catch (error) {
          console.error('Error decoding barcode:', error);
          setBarcode('No barcode detected');
        }
      };
    };

    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <div className="container">
      <h3>Upload a Barcode Image</h3>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Click to select an image</p>
      </div>
      {imageSrc && <img src={imageSrc} alt="Uploaded preview" />}
      <h4>Barcode: {barcode}</h4>
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
          <button className="add-to-tracker-button" onClick={() => setTrackerVisible(true)}>
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
          onClose={() => setTrackerVisible(false)}
          addToTracker={addToTracker}
          foodName={barcode}
          nutrition={nutrition}
        />
      )}
    </div>
  );
};

export default BarcodeUploader;
