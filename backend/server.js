const express = require("express");
const session = require("express-session");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["https://paul1.stevelabs.co", "http://localhost:3000"],
  })
);

app.use(helmet());

app.use(
  session({
    secret: "test",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.APP_ENV !== "local" ? true : false,
      domain: process.env.APP_ENV !== "local" ? ".stevelabs.co" : undefined,
      // sameSite: "none",
    },
  })
);

app.get("/check", (req, res, next) => {
  console.log("/check");
  console.log({
    session: req.session.loginInfo,
  });

  return res.send(req.session.id);
});

app.get("/issue", (req, res, next) => {
  console.log("/issue");
  req.session.loginInfo = { hello: 123 };

  return res.json(loginInfo);
});

app.listen(4000, () => {
  console.log("server start");
});
