const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
// Directorio de vistas
app.set("views", __dirname + "/views");
app.use(express.static("public"));

// Middleware: Permite analizar el contenido de las solicitudes con codificación URL
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  console.log(query);
  // Clave de API proporcionada por OpenWeatherMap para realizar las consultas
  const apiKey = "";
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;

  // Realiza una solicitud GET a la API de OpenWeatherMap
  https.get(url, function (response) {
    console.log(response.statusCode);

    if (response.statusCode === 200) {
      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imgURL =
          "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        // Enviar la respuesta usando la plantilla EJS y pasando los datos del clima
        res.render("weather", {
          cityName: query,
          weatherDescription: weatherDescription,
          temperature: temp,
          imgURL: imgURL,
        });
      });
    } else {
      // Respuesta adicional en caso de que no se encuentre el país o ciudad
      const errorMessage = `Sorry, I couldn't find "${query}" in my database 🥲`;
      res.render("error", { errorMessage: errorMessage });
    }
  });
});

app.listen(3000, function () {
  console.log("Your server is running on port 3000");
});
