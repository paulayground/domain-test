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

app.set("trust proxy", 1);

app.use((req, res, next) => {
  console.log(req.headers);

  const isLocal = [
    req.headers.origin ?? "",
    req.headers.host.split(":")[0],
  ].includes("localhost");

  console.log({
    isLocal,
    origin: req.headers.origin ?? "",
    host: req.headers.host.split(":")[0],
  });

  if (isLocal) {
    session({
      secret: "test",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        domain: undefined,
      },
    })(req, res, next);
  } else {
    session({
      secret: "test",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: true,
        domain: ".stevelabs.co",
      },
    })(req, res, next);
  }
});

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

app.listen(4000, "0.0.0.0", () => {
  console.log("server start", new Date());
});
