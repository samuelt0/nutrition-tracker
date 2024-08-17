import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input, decode_predictions
import numpy as np
import json

# Load class names from the JSON file
with open('EFfNetClasses.json', 'r') as file:
    class_names = json.load(file)

model_path = 'EffNetFood.keras'
# Load the model
model = tf.keras.models.load_model(model_path)

# Function to load and preprocess an image
def load_and_preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(380, 380))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

# List of image paths to test
image_paths = [
    "/content/drive/MyDrive/Colab Notebooks/test/burger.jpg",
    "/content/drive/MyDrive/Colab Notebooks/test/pancakes-01.jpg",      #get the image thru api endpoints?
    "/content/drive/MyDrive/Colab Notebooks/test/pho.jpg",
    "/content/drive/MyDrive/Colab Notebooks/test/spag.jpg"
]

# Evaluate images
for img_path in image_paths:
    img_array = load_and_preprocess_image(img_path)
    predictions = model.predict(img_array)
    class_index = np.argmax(predictions[0]) 

    predicted_label = class_names[str(class_index)]

  

    print(f'Predictions for {img_path}: Class index: {class_index}, Label: {predicted_label}')