// importing necesary dependencies
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import fs from 'node:fs/promises';

// Variables Declaration
let data;
let currentTemperature;
let currentWeatherCode;
let dailyWeatherCodeArray; 
let hourlyWeatherCodeArray;
let dateaAndTime;
let tempDegrees;
let realFeelTemp;
let windSpeed;
let precipitaionProb;
let uvIndex;
let currentTab;
let lon = 33.3366249; //default longitude
let lat = 35.1659936; //default latitude
let country = "Cyprus"; //default country
let address = "";
let key;

// Paste your
// and paste your key there. 
// Make sure you save it.
const filePath = './apiKey.txt';


// lists declaration
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
let tabs = ["weather", "location"];
let weatherText = [];
let time = [];
let dateDay = [];

//getting information from the current date.
let d = new Date();
let hours = d.getHours();
let day = d.getDay();

// creating an express app and setting the port to 3000
const app = express();
const port = 3000;

// Function to convert weather codes to text.
function addWeatherText(){
    for(let i = 0; i < dailyWeatherCodeArray.length; i++){
        if(dailyWeatherCodeArray[i] == 0){
            weatherText.push("Clear Sky");
        }
        else if(dailyWeatherCodeArray[i] == 1){
            weatherText.push("Mainly Clear");
        }
        else if(dailyWeatherCodeArray[i] == 2){
            weatherText.push("Partly cloudy");
        }
        else if(dailyWeatherCodeArray[i] == 3){
            weatherText.push("Overcast");
        }
        else if(dailyWeatherCodeArray[i] == 45 || dailyWeatherCodeArray[i] == 48){
            weatherText.push("Fog");
        }
        else if(dailyWeatherCodeArray[i] == 51 || dailyWeatherCodeArray[i] == 53 || dailyWeatherCodeArray[i] == 55){
            weatherText.push("Drizzle");
        }
        else if(dailyWeatherCodeArray[i] == 56 || dailyWeatherCodeArray[i] == 57){
            weatherText.push("Freezing Drizzle");
        }
        else if(dailyWeatherCodeArray[i] == 61 || dailyWeatherCodeArray[i] == 63 || dailyWeatherCodeArray[i] == 65){
            weatherText.push("Rain");
        }
        else if(dailyWeatherCodeArray[i] == 66 || dailyWeatherCodeArray[i] == 67){
            weatherText.push("Freezing Rain");
        }
        else if(dailyWeatherCodeArray[i] == 71 || dailyWeatherCodeArray[i] == 73 || dailyWeatherCodeArray[i] == 75){
            weatherText.push("Snow Fall");
        }
        else if(dailyWeatherCodeArray[i] == 77){
            weatherText.push("Snow Grains");
        }
        else if(dailyWeatherCodeArray[i] == 80 || dailyWeatherCodeArray[i] == 81 || dailyWeatherCodeArray[i] == 82){
            weatherText.push("Rain Showers");
        }
        else if(dailyWeatherCodeArray[i] == 85 || dailyWeatherCodeArray[i] == 86){
            weatherText.push("Snow Showers");
        }
        else if(dailyWeatherCodeArray[i] == 95){
            weatherText.push("Thunderstorm");
        }
        else if(dailyWeatherCodeArray[i] == 96 || dailyWeatherCodeArray[i] == 99){
            weatherText.push("Hailstorm");
        }
        else{
            weatherText.push("NIL");
        }
     }
}

//Function to equate the parts of the response from the API that  will be used to their respective variable
function assignAllParameters(){
    dailyWeatherCodeArray = data.daily.weathercode;

    if(hours >= 18 && hours <= 23){
        dateaAndTime = data.hourly.time.slice(-6, data.hourly.time.length);
        tempDegrees = data.hourly.temperature_2m.slice(-6, data.hourly.temperature_2m.length);
        hourlyWeatherCodeArray = data.hourly.weathercode.slice(-6, data.hourly.temperature_2m.length);
    }
    else{
       dateaAndTime = data.hourly.time.slice(hours, hours+7);
       tempDegrees = data.hourly.temperature_2m.slice(hours, hours+7);
       hourlyWeatherCodeArray = data.hourly.weathercode.slice(hours, hours+7);
    }
    currentWeatherCode = data.current_weather.weathercode;
    currentTemperature = data.hourly.temperature_2m[hours];
    realFeelTemp = data.current_weather.temperature;
    windSpeed = data.current_weather.windspeed;
    precipitaionProb = data.daily.precipitation_probability_max[0];
    uvIndex = data.daily.uv_index_max[0];
}

//function to get the time from the dateAndTime array
function getTimeFromDateAndTime(){
    for(let i = 0; i < dateaAndTime.length; i++){
       time.push(dateaAndTime[i].slice(-5));
    }
}

//function used to add the names of the various days to an array
function addDaysToArray(){
    let length = data.daily.time.length;
    let counter = 0;
    for(let i = day; i < length; i++){
        if(i == day && counter == 0){
            dateDay.push("Today");
        }
        else if(i == length-1 && counter < length){
            dateDay.push(days[i]);
            i = -1;
        }
        else{
            dateDay.push(days[i]);
        }
        counter++;
    }
}

//function to change a the address so that it can be passed ass a query to the API without any errors
function stringifyAddress(newAdress){
    let length = newAdress.length;
    for(let i = 0 ; i < length; i++){
        if(newAdress[i] == " "){
            address += "%20"
        }else if(newAdress[i] == ","){
            address += "%2C";
        }
        else{
            address += newAdress[i];
        }
    }
}

// Middlewares to parse information given by the user and access static files stored in the public folder.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Renders the default homepage
app.get("/", async (req, res) => {
    currentTab = tabs[0]
    try{
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,rain,surface_pressure,weathercode&daily=weathercode,sunset,uv_index_max,temperature_2m_max,precipitation_probability_max&timezone=auto&current_weather=true&forecast_days=7`);
        data = response.data;
        
        assignAllParameters();
        addWeatherText();
        getTimeFromDateAndTime();
        addDaysToArray();
        
        res.render("index.ejs",{country: country, tab: currentTab, currentTemperature: currentTemperature, currentWeatherCode: currentWeatherCode, time: time, weathercode:hourlyWeatherCodeArray, temperature: tempDegrees, realFeel: realFeelTemp, windSpeed: windSpeed, chanceOfRain: precipitaionProb, currentUvIndex: uvIndex, date: dateDay, dailyWeatherCode : dailyWeatherCodeArray, weatherText: weatherText } );

    }catch(error){
        console.error(`Status: ${error.response.status}, Status Text: ${error.response.statusText}`);
        res.render("error.ejs", {statusCode: error.response.status, statusMessage: error.response.statusText});
    }
    
});

// renders the location page and allows users to enter the location of their choice.
app.get("/location", async (req, res) =>{
    currentTab = tabs[1];
    res.render("location.ejs", {tab: currentTab});
});

// submits the address info provided by the user and redirects user to the home page
// renders the location necessary information to the homepage.
app.post("/submit", async (req, res) => {
    currentTab = tabs[0];
    stringifyAddress(req.body.address);

    // a try-catch error handling method used to get the API key and store it as a variable 
    // it will be used in the API link for authorization when requesting location data.
    try {
        const contents = await fs.readFile(filePath, { encoding: 'utf8' });
        key = contents;
    } catch (error) {
        console.error(error.message);
    }

    // Using try-catch error handling method to request for location data
    //Passing address and the API-key as parameters
    try{
        const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${address}&format=json&apiKey=${key}`);
        const data = response.data;
        lon = data.results[0].lon;
        lat = data.results[0].lat;
        country = data.results[0].country;
        res.redirect("/");
    }catch(error){
        // Logging the status code and text to terminal
        console.error(`Status: ${error.response.status}, Status Text: ${error.response.statusText}`);
        res.render("error.ejs", {statusCode: error.response.status, statusMessage: error.response.statusText});
    }
});

// Listening to port 3000
app.listen(port, ()=>{
    console.log(`Server running from port ${port}`);
    console.log("Copy local URL to browser: localhost:3000");
});


