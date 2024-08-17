from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input
import numpy as np
import json
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

model_path = './EffNetFood.keras'  # Update this path if needed
model = tf.keras.models.load_model(model_path)

def load_and_preprocess_image(img_bytes):
    # Load image from BytesIO object
    img = image.load_img(img_bytes, target_size=(380, 380))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Convert FileStorage to BytesIO
        img_bytes = io.BytesIO(file.read())
        img_array = load_and_preprocess_image(img_bytes)
        predictions = model.predict(img_array)
        class_index = np.argmax(predictions[0])
        with open('EFfNetClasses.json', 'r') as f:
            class_names = json.load(f)
        predicted_label = class_names.get(str(class_index), 'Unknown')
        return jsonify({'label': predicted_label})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
