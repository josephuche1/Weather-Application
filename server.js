// importing necesary dependencies
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import mongoose from "mongoose";
import mongodb from "mongodb";
import bcrypt from "bcrypt";


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

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

const User =  mongoose.model("user", userSchema);


app.get("/", async (req, res) => {
    res.render("index1.ejs");
});

app.post("/login", async (req, res) => {
    try{
        const user = await User.find({username: req.body.username});
        if(user || user.length !== 0){
            res.render("index2.ejs");
        }
        else{
            res.redirect("/");
        }
    } catch(err){
        console.error(`An error has occured: ${err.message}`);
        res.redirect("/")
    }

});

app.post("/signup", async (req,res) => {
   try{
     const user = await User.find({username: req.body.username}); 
     if(!user || user.length === 0){
        const newUser = new User({
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, 15),
            location: req.body.location,
            history:[]
        });
        await newUser.save();
        res.render("index2.ejs");
     }
     else{
        res.redirect("/");
     }
   }catch(err){
     console.error(`An error occured: ${err.message}`);
     res.redirect("/")
   }
});

app.post("")

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

