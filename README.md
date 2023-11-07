# Weather Web Application

## Overview

The Weather Web Application is a user-friendly platform designed to provide accurate weather forecasts for locations around the world. Powered by two robust APIs, for the weather and location data. Both API's were provided by Open-Meteo. This web application ensures users have access to up-to-date weather information at their fingertips. Click <a href="https://github.com/josephuche1/Weather-Application#running-the-weather-web-application-locally">Here</a> to see the steps on how to run it on your local computer

## Features

### 1. Home Page

The Home Page serves as the default landing page, displaying the current weather forecast for Cyprus. Users can quickly access essential weather information, including temperature, humidity, wind speed, and more. The intuitive design and clean layout make it easy for users to grasp the weather conditions at a glance.

<img src="./readMeImages/Screenshot (115).png" alt="Weather Web Application home page">

### 2. Location Page

The Location Page empowers users to customize their weather experience. By entering a location of their choice, users can instantly retrieve the weather forecast for that specific area. This feature ensures that the Weather Web Application caters to the individual needs of each user, no matter where they are located.

<img src="./readMeImages/Screenshot (116).png" alt="Weather Web Application location page">

### 3. Error Page

The Error Page is a helpful feature that gracefully handles any server errors that may occur during usage. When an error is encountered, this page is displayed, ensuring users are informed about the issue and can take appropriate action or seek assistance if necessary.

<img src="./readMeImages/Screenshot (117).png" alt="Weather Web Application error page">

## Technologies Used

<h3>Node.js:</h3> The backend is powered by <a href="https://nodejs.org/api/">Node.js</a>, providing a scalable and efficient server environment.

<h3>Express.js:</h3> <a href="https://expressjs.com/">Express.js</a> is used to create a robust and flexible web application framework.

<h3>Bootstrap:</h3> <a href="https://getbootstrap.com/">Bootstrap</a> is employed for responsive and visually appealing front-end design.

<h3>EJS (Embedded JavaScript):</h3> <a href="https://www.npmjs.com/package/ejs">EJS</a> templates are used for dynamic content rendering, allowing for seamless updates of weather information.

<h3>Axios:</h3> <a href="https://axios-http.com/docs/intro">Axios</a> is utilized for making HTTP requests to fetch data from external APIs.

<h3>Body-Parser npm:</h3> <a href="https://www.npmjs.com/package/body-parser">Body-Parser</a> is used to parse incoming request bodies, simplifying data retrieval and processing.

<h3>Open-Meteo Weather Forecast API:</h3> <a href="https://open-meteo.com/en/docs">Open-Meteo weather forecast API</a> provides accurate weather data for the application.

<h3>Geoapify Geocoding API:</h3> <a href="https://apidocs.geoapify.com/docs/geocoding/forward-geocoding/#about">Geoapify</a> is used for obtaining location information, including longitude and latitude.

<hr>

## Running the Weather Web Application Locally

Follow these steps to run the Weather Web Application on your local computer:

### Step 1: Clone the Repository

If you haven't already, clone the Weather Web Application repository to your local machine. Open your terminal and run the following command

```bash
git clone https://github.com/josephuche1/Weather-Application
```
### Step 1: Install Dependencies

Open your terminal and navigate to the project's root folder. Run the following command to install the necessary dependencies:

```bash
npm i
```

### Step 2: Get Your Geoapify Geocoding API Key

1. Go to the [Geoapify Geocoding API](https://apidocs.geoapify.com/docs/geocoding/forward-geocoding/#about) and sign up or log in to get a unique API key.

2. After obtaining your API key, copy it to your clipboard.

3. Locate the `apiKey.txt` file in the project's root folder and paste your API key into it. Save the file when you're done.

### Step 3: Start the Server

In your terminal, enter the following command to start the server using `nodemon`:

```bash
nodemon server.js
```

### Step 4: Access the Application

Once the server is running, you will see a message indicating that the server is listening on a local URL, typically `http://localhost:3000`. Copy this URL and paste it into your web browser.

Now, you can explore the Weather Web Application locally and enjoy real-time weather forecasts and information.


