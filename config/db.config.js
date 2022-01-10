const { MongoClient } = require('mongodb');
const logger = require('../logger/api.logger');

const connect = async () => {
  const uri = process.env.MONGO_CONNECTION_STRING;
  const client = new MongoClient(uri);
  logger.info('process.env.MONGO_CONNECTION_STRING :::' + process.env.MONGO_CONNECTION_STRING);

  try {
    await client.connect();
    await listDatabases(client);
  } catch (e) {
    logger.error(e);
  } finally {
    await client.close();
  }
};

const listDatabases = async (client) => {
  const databasesList = await client.db().admin().listDatabases();
  databasesList.databases.forEach((db) => logger.info(`Databases List - ${db.name}`));
};

module.exports = {
  connect,
};
