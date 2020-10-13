"use strict";

require("dotenv").config();
const PORT = process.env.PORT;
const SECRET = process.env.SECRET;
const COOKIE_MAX_AGE = +process.env.COOKIE_MAX_AGE;

const _console_log = console.log;
const _console_error = console.error;
console.log = (...args) => {
  _console_log("[INFO]", ...args);
};
console.error = (...args) => {
  _console_error("[ERROR]", ...args);
};

const Express = require("express");
const Session = require("express-session");
const Users = require("./users.js");
const MongoUtil = require("./mongo.js");
const jsonParser = require("body-parser").json;
const validateEmail = require("email-validator").validate;
const app = new Express();
const MONGO_CLIENT = MongoUtil.createClient()
let mongoClientReady = false;

class HttpException {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
}

app.use(jsonParser());
app.use(new Session({
  secret: SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: COOKIE_MAX_AGE
  }
}));
app.use(function(req, res, next) {
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(function(req, res, next) {
   if(mongoClientReady) return next();
   throw new HttpException(503, "Server is not ready.");
});
app.use((err, req, res, next) => {
  if (err instanceof HttpException) sendCodeWithReason(res, err.code, err.message);
  else sendCodeWithReason(res, 500, err);
  next();
});

function sendCodeWithReason(res, code, reason) {
  res.status(code).send(JSON.stringify({
    reason: reason
  }));
}

function endWithReason(res, code, reason) {
  res.status(code).end(JSON.stringify({
    reason: reason
  }));
}

function getUserCollection() {
  return MONGO_CLIENT.db(MongoUtil.database).collection(Users.collection);
}


app.get("/", function(req, res, next) {
  let message = req.session.views ? "Welcome back! Check your views" : "Welcome! You visit this site for the first time.";
  req.session.views = req.session.views ? req.session.views + 1 : 1;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({
    views: req.session.views,
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

app.post("/register", function(req, res, next) {
  if (req.session.hasLoggedIn) {
    endWithReason(res, 403, "You are still logged in!")
  } else {
    let displayName = req.body.dn;
    let email = req.body.em;
    let password = req.body.pw;
    if (!validateEmail(email)) {
      console.warn("Potential hijacking: Front-end allows invalid emails.", email);
      endWithReason(res, 400, "Email is malformed.");
    } else if(password.length < 10) {
      console.warn("Potential hijacking: Front-end allows short password.");
      endWithReason(res, 400, "Password is too short.");
    } else {
      Users.listOneUser(getUserCollection(), {[Users.schema.email]: email},
      (result) => {
        if (result == null) {
          Users.registerNewUser(getUserCollection(), email, password, {[Users.schema.displayName]: displayName},
          (success) => {
            endWithReason(res, 201, "An account is created.");
          },
          (err) => {
            console.error("Cannot register user:", err);
            endWithReason(res, 500, "Cannot register an account.");
          }
        );
        } else {
          endWithReason(res, 400, "Email already exists.")
        }
      }
    )
    }
  }
});

console.log("Connecting to mongodb");
MONGO_CLIENT.connect().then(() => {
  mongoClientReady = true;
  console.log("Connected to mongodb");
})

console.log("Listening to", PORT);
app.listen(PORT);
