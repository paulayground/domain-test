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

console.log(process.env.APP_ENV, "@@@@@@@@");
app.use(
  session({
    secret: "test",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // secure: process.env.APP_ENV !== "local" ? true : false,
      secure: true,
      //   // domain: ".stevelabs.co",
      //   // domain: process.env.APP_ENV !== "local" ? ".stevelabs.co" : null,
    },
    // cookie: { httpOnly: true, secure: false },
  })
);

app.use(express.urlencoded({ extended: true }));

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

  res.cookie(
    "testCookie",
    { message: "test" },
    {
      secret: "test",
      httpOnly: true,
      secure: process.env.APP_ENV !== "local" ? true : false,
      domain: process.env.APP_ENV !== "local" ? ".stevelabs.co" : undefined,
    }
  );

  return res.json(req.session.loginInfo);
});

app.listen(4000, () => {
  console.log("server start", new Date());
});
