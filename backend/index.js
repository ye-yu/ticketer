"use strict";

require("dotenv").config();
const PORT = process.env.PORT;
const SECRET = process.env.SECRET;
const COOKIE_MAX_AGE = +process.env.COOKIE_MAX_AGE;
const Express = require("express");
const Session = require("express-session");
const jsonParser = require("body-parser").json;

let app = new Express();
app.use(jsonParser());
app.use(new Session({
  secret: SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: COOKIE_MAX_AGE
  }
}));

app.get("/", function(req, res, next) {
  let message = req.session.views ? "Welcome back! Check your views" : "Welcome! You visit this site for the first time.";
  req.session.views = req.session.views ? req.session.views + 1 : 1;
  res.setHeader("Content-Type", "application/json");
  // res.header("Content-Security-Policy", "connect-src "self"");
  res.header("Access-Control-Allow-Origin", "*")
  res.end(JSON.stringify({
    views: req.session.views,
    // expires: req.session.cookie.maxAge / 1000,
    message: message,
    queries: {...req.query}
  }));
});

app.get("/revoke", function(req, res, next) {
  req.session.destroy(err => {
    if (err) next(err);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
      ok: 1
    }));
  });
});

app.listen(PORT);
