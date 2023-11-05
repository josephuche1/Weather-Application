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


app.get("/", async (req, res) => {
    res.render("index1.ejs");
});

app.get("/:username", (req, res) => {
    if(req.isAuthenticated){
        res.render("index2.ejs");
    }else{
        res.redirect("/");
    }
    
});

app.post("/login", async (req, res) => {
    
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


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

