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
let dateaAndTime;
let tempDegrees;
let realFeelTemp;
let windSpeed;
let precipitaionProb;
let uvIndex;

let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
let weatherText = [];
let time = [];
let dateDay = [];

let d = new Date();
let hours = d.getHours();
let day = d.getDay();


// Function to convert weather codes to text.
function addWeatherText(req, res, next){
     for(let i = 0; i < weatherCodeArray.length; i++){
        if(weatherCodeArray[i] == 0){
            weatherText.push("Clear Sky");
        }
        else if(weatherCodeArray[i] == 1){
            weatherText.push("Mainly Clear");
        }
        else if(weatherCodeArray[i] == 2){
            weatherText.push("Partly cloudy");
        }
        else if(weatherCodeArray[i] == 3){
            weatherText.push("Overcast");
        }
        else if(weatherCodeArray[i] == 45 || weatherCodeArray[i] == 48){
            weatherText.push("Fog");
        }
        else if(weatherCodeArray[i] == 51 || weatherCodeArray[i] == 53 || weatherCodeArray[i] == 55){
            weatherText.push("Drizzle");
        }
        else if(weatherCodeArray[i] == 56 || weatherCodeArray[i] == 57){
            weatherText.push("Freezing Drizzle");
        }
        else if(weatherCodeArray[i] == 61 || weatherCodeArray[i] == 63 || weatherCodeArray[i] == 65){
            weatherText.push("Rain");
        }
        else if(weatherCodeArray[i] == 66 || weatherCodeArray[i] == 67){
            weatherText.push("Freezing Rain");
        }
        else if(weatherCodeArray[i] == 71 || weatherCodeArray[i] == 73 || weatherCodeArray[i] == 75){
            weatherText.push("Snow Fall");
        }
        else if(weatherCodeArray[i] == 77){
            weatherText.push("Snow Grains");
        }
        else if(weatherCodeArray[i] == 80 || weatherCodeArray[i] == 81 || weatherCodeArray[i] == 82){
            weatherText.push("Rain Showers");
        }
        else if(weatherCodeArray[i] == 85 || weatherCodeArray[i] == 86){
            weatherText.push("Snow Showers");
        }
        else if(weatherCodeArray[i] == 95){
            weatherText.push("Thunderstorm");
        }
        else if(weatherCodeArray[i] == 96 || weatherCodeArray[i] == 99){
            weatherText.push("Hailstorm");
        }
     }
     next();
}

//Function to equate the parts of the response from the API that  will be used to their respective variable
function equateAllParameters(req, res, next){
    dailyWeatherCodeArray = data.daily.weathercode;

    if(hours >= 18 && hours <= 23){
        dateaAndTime = data.hourly.time.slice(-6, data.hourly.time.length);
        tempDegrees = data.hourly.temperature_2m.slice(-6, data.hourly.temperature_2m.length)
    }
    else{
       dateaAndTime = data.hourly.time.slice(hours, hours+7);
       tempDegrees = data.hourly.temperature_2m.slice(hours, hours+7);
    }
    currentWeatherCode = data.current_weather.weathercode;
    currentTemperature = data.hourly.temperature_2m[hours];
    realFeelTemp = data.current_weather.temperature;
    windSpeed = data.current_weather.windspeed;
    precipitaionProb = data.daily.precipitation_probability_max[0];
    uvIndex = data.daily.uv_index_max[0];

    next();
}

//function to get the time from the dateAndTime array
function getTimeFromDateAndTime(req, res, next){
  for(let i = 0; i < dateaAndTime.length; i++){
     time.push(dateaAndTime[i].slice(-5, dateaAndTime.length));
  }
  next();
}

function addDaysToArray(req, res, next){
    let length = data.daily.time.length;
    let counter = 0;
    for(let i = day; i < length; i++){
        if(i == day){
            dateDay.push("Today");
        }
        else if(i == length-1 && counter < length){
            dateDay.push(days[i]);
            i = 0;
        }
        else{
            dateDay.push(days[i]);
        }
        counter++;
    }
}

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(addWeatherText);
app.use(equateAllParameters);
app.use(getTimeFromDateAndTime);


app.get("/", async (req, res) => {

    try{
        const response = await axios.get("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,rain,surface_pressure&daily=weathercode,sunset,uv_index_max,temperature_2m_max,precipitation_probability_max&timezone=auto&current_weather=true&forecast_days=7");
        data = response.data;
        res.render("index.ejs");

    }catch(error){
        console.error(`failed to make request ${error.message}`)
        res.render("index.ejs");

    }
    
});

app.listen(port, ()=>{
    console.log(`Server running from port ${port}`);
});