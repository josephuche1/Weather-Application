// importing necesary dependencies
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", (req, res) => {
    res.render("index1.ejs");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

