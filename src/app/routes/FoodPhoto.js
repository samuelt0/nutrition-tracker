import React, { useState, useRef } from 'react';
import axios from 'axios';
import DailyFoodTracker from '../../components/DailyFoodTracker';
import './FoodPhoto.css';

const FoodPhoto = () => {
  const [view, setView] = useState('main'); // 'main', 'takePhoto', 'confirmPhoto', 'uploadPhoto', 'confirmUpload'
  const [imageSrc, setImageSrc] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [nutrition, setNutrition] = useState(null); // Add state for nutrition data
  const [foodLabel, setFoodLabel] = useState(''); // State for food label
  const [imageFile, setImageFile] = useState(null);
  const [trackerVisible, setTrackerVisible] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleStartCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (error) {
        console.error('Error accessing the camera', error);
        setError('Failed to access the camera');
      }
    }
  };

  const handleCapturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photo = canvas.toDataURL('image/png');
      setImageSrc(photo);
      video.srcObject.getTracks().forEach(track => track.stop()); // Stop the video stream
      setView('confirmPhoto');
    }
  };

  const handleConfirmPhoto = async () => {
    setSuccessMessage('Photo confirmed and sent for processing!');
    setView('main');
    setImageSrc(null); // Clear the photo after confirmation
    setError('');

    // Convert base64 image to Blob
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('file', blob, 'captured_image.png');

      const res = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Log the predicted label
      const predictedLabel = res.data.label;
      console.log(`Predicted Label: ${predictedLabel}`);
      setFoodLabel(predictedLabel);

      // Fetch nutrition data
      const nutritionData = await fetchNutritionData(predictedLabel);
      console.log('Nutrition Data:', nutritionData); // Print nutrition data
      setNutrition(nutritionData);

      // Show the DailyFoodTracker pop-up
      setTrackerVisible(true);
    } catch (error) {
      setError('Failed to process the photo');
      console.error(error);
    }
  };

  const handleCancelPhoto = () => {
    setView('main');
    setImageSrc(null); // Clear the photo when canceling
    setError('');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setImageFile(file);
        setView('confirmUpload');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmUpload = async () => {
    setSuccessMessage('File confirmed and sent for processing!');
    setView('main');
    setImageSrc(null); // Clear the uploaded image after confirmation
    setImageFile(null);
    setError('');

    // Send file to Flask API
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const res = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Log the predicted label
      const predictedLabel = res.data.label;
      console.log(`Predicted Label: ${predictedLabel}`);
      setFoodLabel(predictedLabel);

      // Fetch nutrition data
      const nutritionData = await fetchNutritionData(predictedLabel);
      console.log('Nutrition Data:', nutritionData); // Print nutrition data
      setNutrition(nutritionData);

      // Show the DailyFoodTracker pop-up
      setTrackerVisible(true);
    } catch (error) {
      setError('Failed to process the uploaded file');
      console.error(error);
    }
  };

  const handleCancelUpload = () => {
    setView('uploadPhoto');
    setImageSrc(null); // Clear the uploaded image when canceling
    setError('');
  };

  const handleClick = () => {
    setSuccessMessage('');
    setError('');
  };

  // Function to fetch nutrition data
  const fetchNutritionData = async (foodLabel) => {
    const APP_ID = process.env.REACT_APP_APP_ID;
    const APP_KEY = process.env.REACT_APP_APP_KEY;
    const url = `https://api.edamam.com/api/food-database/v2/parser?ingr=${encodeURIComponent(foodLabel)}&app_id=${APP_ID}&app_key=${APP_KEY}`;

    console.log('Fetching nutrition data from URL:', url);

    try {
      const response = await axios.get(url);
      if (response.data && response.data.hints && response.data.hints.length > 0) {
        const food = response.data.hints[0].food || {};
        const nutrients = food.nutrients || {};
        console.log('Nutrients:', nutrients);

        const formatValue = (value) => {
          const roundedValue = value ? parseFloat(value).toFixed(2) : 0;
          return roundedValue === '0.00' ? 0 : roundedValue;
        };

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
      console.error('Error fetching nutrition data', error);
      setError('Failed to fetch nutrition data');
      return null;
    }
  };

  // Function to handle adding food to the tracker
  const addToTracker = (foodItem) => {
    console.log('Adding to tracker:', foodItem);
    // Here you can add the logic to save foodItem to your backend or local state
    // For now, we'll just close the tracker pop-up
    setTrackerVisible(false);
  };

  return (
    <div className="container">
      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}
      
      {view === 'main' && (
        <div>
          <h3>Upload a Photo</h3>
          <button onClick={() => { handleStartCamera(); setView('takePhoto'); setSuccessMessage(''); }}>Take a Photo</button>
          <button onClick={() => { setView('uploadPhoto'); setSuccessMessage(''); }}>Upload a Photo</button>
        </div>
      )}

      {view === 'takePhoto' && (
        <div>
          <h3>Take a Photo</h3>
          <video ref={videoRef} autoPlay style={{ width: '100%' }}></video>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          <button onClick={handleCapturePhoto}>Capture Photo</button>
          <button onClick={handleCancelPhoto}>Cancel</button>
        </div>
      )}

      {view === 'confirmPhoto' && (
        <div>
          <h3>Confirm Photo</h3>
          <img src={imageSrc} alt="Captured" />
          <button onClick={handleConfirmPhoto}>Confirm</button>
          <button onClick={() => { handleClick(); handleCancelPhoto(); }}>Cancel</button>
        </div>
      )}

      {view === 'uploadPhoto' && (
        <div>
          <h3>Upload a Photo</h3>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={() => document.querySelector('input[type="file"]').click()}>Choose File</button>
          {imageSrc && <img src={imageSrc} alt="Uploaded Preview" />}
        </div>
      )}

      {view === 'confirmUpload' && (
        <div>
          <h3>Confirm Upload</h3>
          <img src={imageSrc} alt="Uploaded" />
          <button onClick={handleConfirmUpload}>Confirm</button>
          <button onClick={handleCancelUpload}>Cancel</button>
        </div>
      )}

      {trackerVisible && (
        <DailyFoodTracker
          foodName={foodLabel}
          nutrition={nutrition}
          onAddToTracker={addToTracker}
          onClose={() => setTrackerVisible(false)}
        />
      )}
    </div>
  );
};

export default FoodPhoto;
