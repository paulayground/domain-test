const express = require("express");

const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res, next) => {
  return res.render("./index.ejs");
});

app.listen("3000", () => console.log("client start"));