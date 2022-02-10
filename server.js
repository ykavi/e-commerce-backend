import express from 'express';
import { MongoClient } from 'mongodb';
import { ApolloServer, gql } from 'apollo-server';
import { DB_CONFIG } from './config/db-config';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3000;
let db;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {
    if (!db) {
      try {
        const dbClient = new MongoClient(process.env.MONGO_CONNECTION_STRING);

        await dbClient.connect();
        db = dbClient.db(DB_CONFIG.DB_NAME);
      } catch (err) {
        console.error(`MongoDB connected fail ${err}`);
      }
    }

    return { db };
  },
});

server.listen(port).then(({ url }) => console.log(`Server running at ${url} `));

/*
app.get('/products', (req, res) => {
  db.collection(COLLECTION.PRODUCT)
    .find({})
    .limit(50)
    .toArray((err, result) => {
      if (err) res.status(400).send('Error fetching listings!');

      res.json(result);
    });
});

app.post('/product', (req, res) => {
  const mappedProduct = productMapper(req.body);
  if (!mappedProduct) {
    res.send(false);
  } else {
    db.collection(COLLECTION.PRODUCT).insertOne(mappedProduct, (error, response) => {
      if (error) {
        res.send(false);
        return false;
      }
      res.json(response?.insertedId);
    });
  }
});

app.put('/api/task', (req, res) => {
  taskController.updateTask(req.body.task).then((data) => res.json(data));
});

app.delete('/api/task/:id', (req, res) => {
  taskController.deleteTask(req.params.id).then((data) => res.json(data));
});

app.get('/', (req, res) => {
  res.send(`<h1>API Works !!!</h1>`);
});

app.post('/create-products', (req, res) => {
  db.createCollection(COLLECTION.PRODUCT, productSchema, (error, result) => {
    if (error) {
      res.send(error);
      logger.error(error);
    }

    logger.info('createdCollection', result?.s?.namespace);
    res.json(result?.s?.namespace);
  });
});

app.post('/create-coupons', (req, res) => {
  db.createCollection(COLLECTION.COUPONS, (error, result) => {
    if (error) {
      res.send(error);
      logger.error(error);
    }

    logger.info('createdCoupons', result?.s?.namespace);
    res.json(result?.s?.namespace);
  });
});

app.post('/create-orders', (req, res) => {
  db.createCollection(COLLECTION.ORDERS, (error, result) => {
    if (error) {
      res.send(error);
      logger.error(error);
    }

    logger.info('createdOrders', result?.s?.namespace);
    res.json(result?.s?.namespace);
  });
});
*/
