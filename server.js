const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");

const app = express();

mongoose.connect("mongodb://localhost/urlShortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const shortUrls = await ShortUrl.find();
    res.render("index", { shortUrls: shortUrls });
  } catch (error) {
    console.error("Error fetching short URLs:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/shortUrls", async (req, res) => {
  try {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect("/");
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});