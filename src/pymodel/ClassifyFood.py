import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input
import numpy as np
import json

# Load class names from the JSON file
with open('EFfNetClasses.json', 'r') as file:
    class_names = json.load(file)

model_path = 'EffNetFood.keras'
# Load the model
model = tf.keras.models.load_model(model_path)

# Function to load and preprocess an image
def load_and_preprocess_image(img):
    img = image.load_img(img, target_size=(380, 380))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

# Function to predict the class of an image
def predict_image_class(img):
    img_array = load_and_preprocess_image(img)
    predictions = model.predict(img_array)
    class_index = np.argmax(predictions[0]) 
    predicted_label = class_names[str(class_index)]
    return predicted_label
