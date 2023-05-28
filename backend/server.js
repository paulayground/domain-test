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

  const isLocal =
    (req.headers.origin ?? "").indexOf("localhost") !== -1 ||
    req.headers.host.indexOf("localhost") !== -1;

  console.log({
    isLocal,
    origin: req.headers.origin ?? "",
    host: req.headers.host,
  });

  if (isLocal) {
    session({
      secret: "test",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: true,
        domain: undefined,
        sameSite: "none",
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

  const isLocal =
    (req.headers.origin ?? "").indexOf("localhost") !== -1 ||
    req.headers.host.indexOf("localhost") !== -1;

  if (isLocal) {
    res.cookie(
      "testCookie",
      { message: "test" },
      {
        secret: "test",
        httpOnly: true,
        secure: false,
        domain: undefined,
      }
    );
  } else {
    res.cookie(
      "testCookie",
      { message: "test" },
      {
        secret: "test",
        httpOnly: true,
        secure: true,
        domain: ".stevelabs.co",
      }
    );
  }

  return res.json(req.session.loginInfo);
});

app.listen(4000, "0.0.0.0", () => {
  console.log("server start", new Date());
});
