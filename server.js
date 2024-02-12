const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const bodyParser = require("body-parser");
const app = express();

mongoose.connect("mongodb://localhost/urlShortener");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    

  res.render("index");
});

app.post("/shortUrl", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirt("/");
});

app.listen(process.env.PORT || 5555);
