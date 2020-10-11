"use strict";

/*
Obtains variables of:
SALT=the salt for password hashing
MONGO_USER=the username for the mongodb
MONGO_PWD=the password for the mongodb
*/
require("dotenv").config();

// constants
const Crypto = require("crypto");
const { MongoClient } = require("mongodb");
const SALT = process.env.SALT;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PWD = process.env.MONGO_PWD;
const MONGO_DB = "ticketerdb";
const MONGO_CO = "admins";
const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PWD}@127.0.0.1:27017/${MONGO_DB}`;
const MONGO_CLIENT = new MongoClient(MONGO_URI, {"useUnifiedTopology": true});

async function connectMongoDb(andThen) {
  await MONGO_CLIENT.connect();
  await MONGO_CLIENT.db(MONGO_DB).command({ ping: 1 });
  console.log("Connected successfully to the server");
  andThen();
}

function closeConnection(err) {
  if (err) console.error(err);
  MONGO_CLIENT.close();
  console.log("Disconnected from the server");
}

function addUser(username, password) {
  console.log(username, password);
}

function hash512(password, salt){
  let hash = Crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  return hash.digest('hex');
};

function listUser() {
  const db = MONGO_CLIENT.db(MONGO_DB);
  const co = db.collection(MONGO_CO);
  co.find({}).toArray((err, result) => {
    if (err) closeConnection(err);
    else {
      console.log(result);
      closeConnection();
    }
  });
}

connectMongoDb(listUser).catch(closeConnection);
