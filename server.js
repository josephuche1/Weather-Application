// importing necesary dependencies
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

/*

*/
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

let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
let tabs = ["weather", "location"];
let weatherText = [];
let time = [];
let dateDay = [];

let d = new Date();
let hours = d.getHours();
let day = d.getDay();

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


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



app.get("/", async (req, res) => {
    currentTab = tabs[0]
    try{
        const response = await axios.get("https://api.open-meteo.com/v1/forecast?latitude=35.1659936&longitude=33.3366249&hourly=temperature_2m,rain,surface_pressure,weathercode&daily=weathercode,sunset,uv_index_max,temperature_2m_max,precipitation_probability_max&timezone=auto&current_weather=true&forecast_days=7");
        data = response.data;
        
        assignAllParameters();
        addWeatherText();
        getTimeFromDateAndTime();
        addDaysToArray();
        
        res.render("index.ejs",{tab: currentTab, currentTemperature: currentTemperature, currentWeatherCode: currentWeatherCode, time: time, weathercode:hourlyWeatherCodeArray, temperature: tempDegrees, realFeel: realFeelTemp, windSpeed: windSpeed, chanceOfRain: precipitaionProb, currentUvIndex: uvIndex, date: dateDay, dailyWeatherCode : dailyWeatherCodeArray, weatherText: weatherText } );

    }catch(error){
        console.error(`failed to make request ${error.message}`)
        res.render("index.ejs");

    }
    
});

app.get("/location", (req, res) =>{
    currentTab = tabs[1];
    res.render("location.ejs", {tab: currentTab});
});

app.listen(port, ()=>{
    console.log(`Server running from port ${port}`);
});


