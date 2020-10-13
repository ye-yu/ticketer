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
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const app = new Express();
const MONGO_CLIENT = MongoUtil.createClient();
let mongoClientReady = false;
let server = {close: () => console.error("Server has not started.")};

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

function end(res, obj, code=200) {
  res.status(code).end(JSON.stringify(obj));
}

function getUserCollection() {
  return MONGO_CLIENT.db(MongoUtil.database).collection(Users.collection);
}

app.get("/", function(req, res, next) {
  let message = req.session.views ? "Welcome back! Check your views" : "Welcome! You visit this site for the first time.";
  req.session.views = req.session.views ? req.session.views + 1 : 1;
  res.setHeader("Content-Type", "application/json");
  end(res, {
    views: req.session.views,
    message: message,
    queries: {...req.query}
  });
});

app.get("/revoke", function(req, res, next) {
  req.session.destroy(err => {
    if (err) next(err);
    res.setHeader("Content-Type", "application/json");
    end(res, {ok:1});
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
      );
    }
  }
});

app.get("/session", function(req, res, next) {
  if(!req.session.ticketerSession) {
    end(res, {session: false});
  } else {
    end(res, {
      session: true,
      name: req.session.dn,
      avatarSmall: req.session.avatarSmall
    });
  }
});

app.post("/login", function(req, res, next) {
  Users.authenticateUser(getUserCollection(), req.body.em, req.body.pw,
    (success) => end(res, {"ok": 1}),
    (err) => endWithReason(res, 400, err)
  );
})

app.post("*", function(req, res, next) {
  endWithReason(res, 404, `Could not resolve ${req.url}.`);
  console.error("Client requested inexistent path", req.url);
});

function connect() {
  console.log("Connecting to mongodb...");
  MONGO_CLIENT.connect().then(() => {
    mongoClientReady = true;
    console.log("Connected to mongodb.");
  }).catch(console.error);

  console.log(`Listening to ${PORT}...`);
  server = app.listen(PORT);
}
function prompt() {
  console.log("'d' to disconnect.");
  console.log("'q' to quit.");
  console.log("'c' to reconnect.");
  console.log("'i' to check MongoDB connection.")
  readline.question("", (command) => {
    if (command === 'q') process.exit(0);
    else if (command === 'c') connect();
    else if (command === 'i') console.log(mongoClientReady ? "MongeDB client is still connected." : "MongoDB is not connected.");
    else if (command === 'd') {
      console.log("Wait for the driver to disconnect.");
      server.close(() => console.log("Server has been terminated."));
      MONGO_CLIENT.close().then(() => {
        mongoClientReady = false;
        console.log("Disconnected from MongoDB.")
      });
    } else {
      console.log("Unknown command:", command);
    }
    prompt();
  });
}

connect();
prompt();
