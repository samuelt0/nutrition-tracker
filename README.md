# Nutrition Tracker Frontend

## Demo
Demo will be available in the future.

## Project Description

This project is a web app that allows users to track their daily nutrition data using information such as calories, sugar, fat, and other relevant information from the Edamame API. The frontend was built using React (JS/HMTL/CSS), Flask, and various libraries for interacting with data. Keras and Tensorflow were used to fine-tune an EfficientNet model on 180 different types of food. React was used to create the frontend application and send requests to both the Edamame API and Spring Boot endpoints. Flask was used to communicate to the frontend and classifier pipeline.

### Features
Users can look up food using the built in search function, take a picture of a barcode, or snap an image of food to be classified (see demo).

An aggregate dataset comprised of the MAFood-121 Dataset ([Link](https://www.kaggle.com/datasets/theviz/mafood121)) and the Food-101 Dataset [Link](https://www.kaggle.com/datasets/dansbecker/food-101) was created, resulting in 93,748 training images and 26,825 evaluation images with a total of 180 different dishes. 

The base EfficientNet model from Keras (imagenet weights) was then fine tuned for 10 epochs on this dataset, giving an accuracy of 87.74%.
