const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrls");
const dotenv = require("dotenv");
const app = express();

// mongoose.connect("mongodb://localhost/urlShortner", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index.hbs", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ fullUrl: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ shortUrl: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);
  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.fullUrl);
});

app.listen(process.env.PORT || 5000);
