const console = require("console");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) {
    const query = req.body.cityName;
    console.log(query);
    const apiKey = "251299f117789673cd2623949016182d";
    const unit = "metric";
    const url = ("https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid=" + apiKey + "&units=" + unit);
    https.get(url, function(response) {
        console.log(response.statusCode); 

        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon
            const imgURL = "http://openweathermap.org/img/wn/" +icon+ "@2x.png";

            res.write('<head><meta charset="utf-8"></head>');
            res.write("<h2 class='weather-description'>The weather is currently "+ weatherDescription + "</h2>");
            res.write("<h1>The temperature in "+ query +" is " + temp + " degrees Celcius</h1>");
            res.write("<img src=" + imgURL + ">");
            res.send();
        });
    });
});

app.listen(3000, function() {
    console.log("Your server is running on in port 3000");
})