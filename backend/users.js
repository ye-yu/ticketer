"use strict";

/*
Obtains variables of:
SALT=the salt for password hashing
MONGO_USER=the user for the mongodb
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

function updateUser(collection, user, password, andThen) {
  const hash = hash512(password, SALT);
  collection.find({"user":user}).toArray((err, result) => {
    if (result.length > 0) {
      collection.updateOne({"user":user}, {"$set":{"password":hash}}, (err, result) => {
        if (err) console.error("Update operation err:", err);
        else console.log("Update operation:", result.result);
        andThen();
      });
    } else {
      collection.insertOne({"user":user, "password":hash}, (err, result) => {
        if (err) console.error("Insert operation err:", err);
        else console.log("Insert operation:", result.result);
        andThen();
      });
    }
  });
}

function listUser(collection, attribute) {
  collection.find(attribute).toArray((err, result) => {
    if (err) closeConnection(err);
    else {
      console.log(result);
      closeConnection();
    }
  });
}

function removeUser(collection, user, andThen) {
  collection.removeOne({"user":user}, (err, result) => {
    if (err) console.error("Remove operation err:", err);
    else console.log("Remove operation:", result.result);
    andThen();
  });
}

function formatUsers(collection, andThen) {
  collection.remove({}, (err, result) => {
    if (err) console.error("Remove operation err:", err);
    else console.log("Remove operation:", result.result);
    andThen();
  });
}

function authenticateUser(collection, user, password, whenAuthenticationValid, whenAuthenticationInvalid) {
  const hash = hash512(password, SALT);
  collection.findOne({"user":user}, (err, result) => {
    if (err ) whenAuthenticationInvalid(err);
    else if (result == null) whenAuthenticationInvalid(`Cannot authenticate ${user}`);
    else {
      if (result.password === hash) whenAuthenticationValid("Authentication successful");
      else whenAuthenticationInvalid("Authentication failed");
    }
  });
}

function updateUserCLI(user, password) {
  connectMongoDb(() => updateUser(MONGO_CLIENT.db(MONGO_DB).collection(MONGO_CO), user, password, closeConnection)).catch(closeConnection);
}

function listUserCLI() {
  connectMongoDb(() => listUser(MONGO_CLIENT.db(MONGO_DB).collection(MONGO_CO), {})).catch(closeConnection);
}

function removeUserCLI(user) {
  connectMongoDb(() => removeUser(MONGO_CLIENT.db(MONGO_DB).collection(MONGO_CO), user, closeConnection)).catch(closeConnection);
}

function formatUsersCLI() {
  connectMongoDb(() => formatUsers(MONGO_CLIENT.db(MONGO_DB).collection(MONGO_CO), closeConnection)).catch(closeConnection);
}

function authenticateUserCLI(user, password) {
  connectMongoDb(() => authenticateUser(MONGO_CLIENT.db(MONGO_DB).collection(MONGO_CO), user, password, closeConnection, closeConnection)).catch(closeConnection);
}

const QUERY_TREE = {
  "manager": {
    "update": updateUserCLI,
    "list": listUserCLI,
    "remove": removeUserCLI,
    "format": formatUsersCLI
  },
  "authenticate": authenticateUserCLI
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
    updateUser: updateUser,
    authenticateUser: authenticateUser
  };
}
