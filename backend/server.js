const express = require("express");
const session = require("express-session");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["https://paul1.stevelabs.co", "http://localhost:3000"],
  })
);
app.use(cookieParser());

app.set("trust proxy", 1);

const sessionOptions = {
  secret: "test",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // 초기값 설정
    sameSite: undefined, // 초기값 설정
    domain: undefined, // 초기값 설정
  },
};

app.use(session(sessionOptions));

app.use((req, res, next) => {
  const isLocal =
    (req.headers.origin ?? "").indexOf("localhost") !== -1 ||
    req.headers.host.indexOf("localhost") !== -1;

  const isBackendLocal = req.headers["user-agent"].indexOf("Postman") !== -1;

  console.log({
    isLocal,
    isBackendLocal,
  });

  if (isLocal) {
    sessionOptions.cookie.secure = isBackendLocal ? false : true;
    sessionOptions.cookie.sameSite = isBackendLocal ? undefined : "none";
  } else {
    sessionOptions.cookie.secure = true;
    sessionOptions.cookie.domain = ".stevelabs.co";
  }

  session(sessionOptions)(req, res, next);
});

app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.get("/check", (req, res, next) => {
  console.log("/check");
  console.log({
    session: req.session.loginInfo,
    cookie: req.headers.cookie,
  });

  res.json(req.session.id);
});

app.get("/issue", (req, res, next) => {
  console.log("/issue");
  req.session.loginInfo = { hello: 123 };

  const isLocal =
    (req.headers.origin ?? "").indexOf("localhost") !== -1 ||
    req.headers.host.indexOf("localhost") !== -1;

  const isBackendLocal = req.headers["user-agent"].indexOf("Postman") !== -1;

  if (isLocal) {
    res.cookie(
      "testCookie",
      { message: "test" },
      {
        secret: "test",
        httpOnly: true,
        secure: isBackendLocal ? false : true,
        sameSite: isBackendLocal ? undefined : "none",
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

  console.log(req.session);

  res.json(req.session.loginInfo);
});

app.listen(4000, "0.0.0.0", () => {
  console.log("server start", new Date());
});
