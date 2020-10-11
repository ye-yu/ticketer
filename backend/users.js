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
const MongoUtil = require("./mongo.js");
const SALT = process.env.SALT;
const MONGO_CO = "users";
const MONGO_DB = MongoUtil.database;
const MONGO_CLIENT = MongoUtil.createClient()

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

function hash512(password, salt){
  let hash = Crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  return hash.digest('hex');
};

function updateUser(username, password) {
  const hash = hash512(password, SALT);
  connectMongoDb(() => {
    const admins = MONGO_CLIENT.db(MONGO_DB).collection(MONGO_CO)
    admins.find({"user":username}).toArray((err, result) => {
      if (result.length > 0) {
        admins.updateOne({"user":username}, {"$set":{"password":hash}}, (err, result) => {
          if (err) console.error("Update operation err:", err);
          else console.log("Update operation:", result.result);
          closeConnection();
        });
      } else {
        admins.insertOne({"user":username, "password":hash}, (err, result) => {
          if (err) console.error("Insert operation err:", err);
          else console.log("Insert operation:", result.result);
          closeConnection();
        });
      }
    });
  }).catch(closeConnection);
}

function listUser() {
  connectMongoDb(() => {
    const db = MONGO_CLIENT.db(MONGO_DB);
    const co = db.collection(MONGO_CO);
    co.find({}).toArray((err, result) => {
      if (err) closeConnection(err);
      else {
        console.log(result);
        closeConnection();
      }
    });
  }).catch(closeConnection);
}

function removeUser(username) {
  connectMongoDb(() => {
    const admins = MONGO_CLIENT.db(MONGO_DB).collection(MONGO_CO)
    admins.removeOne({"user":username}, (err, result) => {
      if (err) console.error("Remove operation err:", err);
      else console.log("Remove operation:", result.result);
      closeConnection();
    });
  }).catch(closeConnection);
}

function formatUsers() {
  connectMongoDb(() => {
    const admins = MONGO_CLIENT.db(MONGO_DB).collection(MONGO_CO)
    admins.remove({}, (err, result) => {
      if (err) console.error("Remove operation err:", err);
      else console.log("Remove operation:", result.result);
      closeConnection();
    });
  }).catch(closeConnection);
}

function authenticateUser(username, password) {
  const hash = hash512(password, SALT);
  connectMongoDb(() => {
    const admins = MONGO_CLIENT.db(MONGO_DB).collection(MONGO_CO)
    admins.findOne({"user":username}).toArray((err, result) => {
      if (result.length > 0) {
        if (result[0].password === hash) console.log("Authentication successful");
        else console.error("Authentication failed");
        closeConnection();
      } else {
        console.error(`Cannot authenticate ${user}`);
        closeConnection();
      }
    });
  }).catch(closeConnection);
}

const QUERY_TREE = {
  "manager": {
    "update": updateUser,
    "list": listUser,
    "remove": removeUser,
    "format": formatUsers
  },
  "authenticate": authenticateUser
}

function query(params, tree = QUERY_TREE) {
  if (params.length == 0) {
    console.error("Unknown query");
    return;
  }
  let r = tree[params[0]]
  let args = params.slice(1);

  if (typeof r === "function") return r(...args);
  else return query(args, r);
}

if (!module.parent){
  query(process.argv.slice(2));
} else {
  module.exports = {
    MONGO_CLIENT: MONGO_CLIENT
  };
}
