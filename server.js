// importing necesary dependencies
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

/*

*/
let weatherCodeArray; 
let weatherText = [];

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

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(addWeatherText);


app.get("/", async (req, res) => {

    try{
        const response = await axios.get("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,rain,surface_pressure&daily=weathercode,sunset,uv_index_max,temperature_2m_max,precipitation_probability_max&timezone=auto&current_weather=true&forecast_days=7");
        const data = response.data;
        weatherCodeArray = data.daily.weathercode;
        res.render("index.ejs");

    }catch(error){
        console.error(`failed to make request ${error.message}`)
        res.render("index.ejs");

    }
    
});

app.listen(port, ()=>{
    console.log(`Server running from port ${port}`);
});