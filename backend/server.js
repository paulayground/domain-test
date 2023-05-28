const express = require("express");
const session = require("express-session");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// app.use(
//   cors({
//     credentials: true,
//     origin: true,
//   })
// );

// app.use(helmet());

app.use(
  session({
    secret: "test",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      // domain: "igchat.o-r.kr",
      // sameSite: "none",
    },
  })
);

app.get("/", (req, res, next) => {
  console.log("/");
  console.log({
    session: req.session.loginInfo,
  });

  return res.json(true);
});

app.get("/issue", (req, res, next) => {
  console.log("/issue");
  req.session.loginInfo = { hello: 123 };

  return res.json(true);
});

app.listen(4000, () => {
  console.log("server start");
});
