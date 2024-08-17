import React, { useState, useRef } from 'react';
import axios from 'axios';
import './FoodPhoto.css';

const FoodPhoto = () => {
  const [view, setView] = useState('main'); // 'main', 'takePhoto', 'confirmPhoto', 'uploadPhoto', 'confirmUpload'
  const [imageSrc, setImageSrc] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);

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
    // Future implementation: send imageSrc to the model for classification
  };

  const handleCancelPhoto = () => {
    setView('main');
    setImageSrc(null); // Clear the photo when canceling
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
    // Future implementation: send imageFile to the model for classification
  };

  const handleCancelUpload = () => {
    setView('uploadPhoto');
    setImageSrc(null); // Clear the uploaded image when canceling
  };

  const handleClick = () => {
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  return (
    <div className="container">
      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}
      
      {view === 'main' && (
        <div>
          <h3>Food Photo Page</h3>
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
          <img src={imageSrc} alt="Uploaded Preview" />
          <button onClick={handleConfirmUpload}>Confirm</button>
          <button onClick={() => { handleClick(); handleCancelUpload(); }}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default FoodPhoto;
