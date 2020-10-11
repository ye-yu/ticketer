const { MongoClient } = require("mongodb");
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PWD = process.env.MONGO_PWD;
const MONGO_DB = "ticketerdb"

function createClient() {
  const uri = `mongodb://${MONGO_USER}:${MONGO_PWD}@127.0.0.1:27017/${MONGO_DB}`;
  return new MongoClient(uri, {"useUnifiedTopology": true});
}

module.exports = {
  createClient: createClient,
  database: MONGO_DB
};
