// importing necesary dependencies
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import mongoose from "mongoose";
import mongodb from "mongodb";
import session from "express-session";
import passport from "passport"
import passportLocalMongoose from "passport-local-mongoose";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
//set up session
app.use(session({
    secret:"weatherApplication1",
    resave:false,
    saveUninitialized:false
}));
// initialize passport
app.use(passport.initialize());
// set up passport to work with express session
app.use(passport.session());


mongoose.connect("mongodb+srv://admin-joseph:olisa312@cluster0.phfwo7l.mongodb.net/weatherApp")
   .then(() => {
        console.log("Connected to database successfully.")
   })
   .catch((err) => {
      console.log(`Failed to connect to database: ${err.message}`);
   })

const userSchema = new mongoose.Schema({
    username:String,
    password:String,
    location:String,
    history:[String]
});

userSchema.plugin(passportLocalMongoose);

const User =  new mongoose.model("user", userSchema);

// set up passport-local dependency, this will help us serialize and desialize user information 
// during authentication. it is used with the mongoose model.
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// function to gather and store all required information on 
// the current weather in an object
// @param daily Object will be returned from the weather API
// @param current Object will be returned from the weather API
// returns `current` object
function currentMore(daily, locationData){
    const d = new Date();
    const hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
    const minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
    const current = {
        location: locationData.name,
        high: Math.round(daily.apparent_temperature_max[0]) ,
        low: Math.round(daily.apparent_temperature_min[0]),
        dayAndTime: `${days[d.getDay()]}, ${hour}:${minute}`,
        uvIndex: Math.round(daily.uv_index_max[0]),
        chanceOfRain: daily.precipitation_probability_max[0]
    };
    return current;
}

// function to collect and store all the necessary information on the
// hourly forecast in an object
// @param hourly Object is return from weather API
// return `arrayHourly` an array containing all the necessary forecast information for
// upto 6 hours from the current hour
function hourlyEdit(hourly){
    const d = new Date();
    const hour = d.getHours();

    const start = hourly.time.findIndex((date) => new Date(date).getHours() > hour);

    let arrayHourly = [];

    for(let i = start; i < start + 6; i++){
         const dt = new Date(hourly.time[i]);
         const hours = dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours();
         const minutes = dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes();
         
         const hourlyWeather = {
            time: `${hours}:${minutes}`,
            temp: Math.round(hourly.apparent_temperature[i]),
            weathercode: hourly.weathercode[i],
            rainProbability: hourly.precipitation_probability[i],
        }
        
        arrayHourly.push(hourlyWeather);
    }
    
    return arrayHourly;
}

// Function to help convert weathercodes to 
// text that will be displayed to users
function WeatherInterpretation(){
    const descriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly clear",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        56: "Light freezing drizzle",
        57: "Dense freezing drizzle",
        61: "Slight Rain",
        63: "Moderate rain",
        65: "Heavy rain",
        66: "Light freezing rain",
        67: "Heavy freezing rain",
        71: "Slight snow fall",
        73: "Moderate snow fall",
        75: "Heavy snow fall",
        77: "Snow grains",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        99: "Thunderstorm (Hail)"
    };

    return descriptions;
}

// function to collect and store all the necessary information for a 7-day forecast in an object
// @param daily Object is return from weather API
// return `arrayDaily` an array containing all the necessary forecast information for
// upto 7 days from the current hour
function dailyEdit(daily){
    const descriptions = WeatherInterpretation();

    const dt = new Date();
    const currentDay = dt.getDay();

    const arrayDaily = [];

    for(let i = 0; i < 7; i++){
        const d = new Date(daily.time[i]);
        const dy = d.getDay();
        const dailyT = {
            day: dy === currentDay?"Today":days[dy],
            weathercode: daily.weathercode[i],
            description: descriptions[daily.weathercode[i]],
            high: daily.apparent_temperature_max[i],
            low: daily.apparent_temperature_min[i]
        }
        arrayDaily.push(dailyT);
    }
    return arrayDaily;
}



app.get("/", async (req, res) => {
    res.render("index1.ejs");
});

app.get("/:username", async (req, res) => {
     try{
        const user = await User.findOne({username:req.params.username});
        if(user || user.length !== 0){
            //get location data
            const location = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${user.location}&count=1&language=en&format=json`);
            const locationData = location.data.results[0];
            // get weather data
            const weather = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${locationData.latitude}&longitude=${locationData.longitude}&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,surface_pressure,relative_humidity_2m&hourly=apparent_temperature,weathercode,precipitation_probability&daily=weathercode,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_probability_max,sunset&timezone=auto`);
            const weatherData = weather.data;
            
            const current = currentMore(weatherData.daily, locationData);
            const hourly = hourlyEdit(weatherData.hourly);  
        }
        res.render("index2.ejs")
     }catch(err){
        console.log("Error: "+ err.message)
     }
    
});

app.post("/login", async (req, res) => {
    const user = new User({
        username: req.body.username ,
        password: req.body.password
    });

    req.login(user, (err) => {
        if(err){
            console.error(err.message);
            res.redirect("/")
        }
        else{
            passport.authenticate("local")(req, res, () => {
                res.redirect(`/${req.body.username}`);
            })
        }
    })
});

app.post("/signup", async (req,res) => {
    User.register({username:req.body.username, location:req.body.location, history:[]}, req.body.password, (err, user) => {
        if(err){
            console.error(`an error has occurred: ${err.message}`);
            res.redirect("/");
        }
        else{
            passport.authenticate("local")(req,res, () => {
                res.redirect(`/${req.body.username}`);
            })
        }
    })
});

app.get("/logout", (req,res) => {
    req.logout();
    res.redirect("/");
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

