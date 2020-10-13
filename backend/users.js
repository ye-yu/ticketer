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
const schema = {
  email: "email",
  password: "password",
  displayName: "displayName",
  role: "role",
  banned: "banned"
}

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
  let hash = Crypto.createHmac("sha512", salt); /** Hashing algorithm sha512 */
  hash.update(password);
  return hash.digest("hex");
};

function updateUser(collection, user, password, andThen) {
  const hash = hash512(password, SALT);
  collection.find({[schema.email]:user}).toArray((err, result) => {
    if (result.length > 0) {
      collection.updateOne({[schema.email]:user}, {"$set":{[schema.password]:hash}}, (err, result) => {
        if (err) console.error("Update operation err:", err);
        else console.log("Update operation:", result.result);
        andThen();
      });
    } else {
      collection.insertOne({[schema.email]:user, [schema.password]:hash}, (err, result) => {
        if (err) console.error("Insert operation err:", err);
        else console.log("Insert operation:", result.result);
        andThen();
      });
    }
  });
}

function registerNewUser(collection, email, password, attributes, onSuccessful, onError) {
  let insert = {email: email, password: hash512(password, SALT), ...attributes};
  collection.insertOne(insert, (err, result) => {
    if (err) onError(err);
    else onSuccessful(result);
  });
}

function listUser(collection, attribute, andThen) {
  collection.find(attribute).toArray((err, result) => {
    if (err) console.err(err);
    else {
      console.log(result);
      andThen();
    }
  });
}

function listOneUser(collection, attribute, onSuccessful, onError) {
  collection.findOne(attribute, (err, result) => {
    if (err) onError(err);
    else onSuccessful(result);
  });
}

function removeUser(collection, user, andThen) {
  collection.removeOne({[schema.email]:user}, (err, result) => {
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
  collection.findOne({[schema.email]:user}, (err, result) => {
    if (err) whenAuthenticationInvalid(err);
    else if (result == null) whenAuthenticationInvalid(`Cannot authenticate ${user}`);
    else {
      if (result.password === hash) whenAuthenticationValid(result);
      else whenAuthenticationInvalid("Authentication failed");
    }
  });
}

function putTag(collection, user, tag, andThen) {
  collection.findOneAndUpdate({[schema.email]:user}, {"$set": tag}, {}, (err, result) => {
    if (err) console.error("Put tag operation err:", err);
    else console.log("Put tag operation:", result);
    andThen();
  });
}

function takeTag(collection, user, tag, andThen) {
  const unset = {};
  unset[tag] = "";
  collection.findOneAndUpdate({[schema.email]:user}, {"$unset": unset}, {}, (err, result) => {
    if (err) console.error("Take tag operation err:", err);
    else console.log("Take tag operation:", result);
    andThen();
  });
}

function getTag(collection, user, tag, andThen) {
  collection.findOne({[schema.email]:user}, (err, result) => {
    andThen(result[tag]);
  });
}

function updateUserCLI(user, password) {
  connectMongoDb(() => updateUser(MONGO_CLIENT.db(MONGO_DB).collection(MONGO_CO), user, password, closeConnection)).catch(closeConnection);
}

function listUserCLI() {
  connectMongoDb(() => listUser(MONGO_CLIENT.db(MONGO_DB).collection(MONGO_CO), {}, closeConnection)).catch(closeConnection);
}

function listOneUserCLI(attribute, value) {
  connectMongoDb(() => listOneUser(
    MONGO_CLIENT.db(MONGO_DB).collection(MONGO_CO),
    {[attribute]: value},
    (successful) => {
      console.log("Got user", successful);
      closeConnection();
    },
    closeConnection
  )).catch(closeConnection);
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

function putTagUserCLI(...args) {
  if (args.length < 3) return console.error("Not enough argument");
  console.log(args);
  const user = args[0];
  const tagName = args[1];
  const tagValue = args.slice(2);
  const tag = {};
  tag[tagName] = tagValue.length == 1 ? tagValue[0] : tagValue;
  connectMongoDb(() => putTag(MONGO_CLIENT.db(MONGO_DB).collection(MONGO_CO), user, tag, closeConnection)).catch(closeConnection);
}

function takeTagUserCLI(user, tag) {
  connectMongoDb(() => takeTag(MONGO_CLIENT.db(MONGO_DB).collection(MONGO_CO), user, tag, closeConnection)).catch(closeConnection);
}

function getTagUserCLI(user, tag) {
  connectMongoDb(() => getTag(MONGO_CLIENT.db(MONGO_DB).collection(MONGO_CO), user, tag, (tagValue) => {
    console.log(`${tag} => ${tagValue}`);
    closeConnection();
  })).catch(closeConnection);
}

const QUERY_TREE = {
  "credential": {
    "list": listUserCLI,
    "one": listOneUserCLI,
    "update": updateUserCLI,
    "remove": removeUserCLI,
    "format": formatUsersCLI,
    "authenticate": authenticateUserCLI
  },
  "tag": {
    "put": putTagUserCLI,
    "take": takeTagUserCLI,
    "get": getTagUserCLI
  },
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
    registerNewUser: registerNewUser,
    listOneUser: listOneUser,
    authenticateUser: authenticateUser,
    putTag: putTag,
    takeTag: takeTag,
    getTag: getTag,
    collection: MONGO_CO,
    schema: schema
  };
}
