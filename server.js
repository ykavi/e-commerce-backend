const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { ApolloServer, gql } = require('apollo-server');

const logger = require('./logger/api.logger');
const { DB_NAME, COLLECTION } = require('./config/db-config');
const { productSchema } = require('./db-schemas/product-schema');
const { productMapper } = require('./utils/mapper');

const typeDefs = gql`
  type Query {
    Products(ids: [String]): [Products]
  }
  type Products {
    _id: String!
    title: String
    price: Int!
    discountedPrice: Int
    hasDiscount: Boolean!
    images: [String]
    stock: Int
    description: String
    categoryCode: String
    currency: String
    values: [String]
    cargoDetail: CargoDetail
  }
  type CargoDetail {
    free: Boolean
    price: Int
  }
`;

const resolvers = {
  Query: {
    Products: async (parent, args, context, info) => {
      return await db
        .collection(COLLECTION.PRODUCT)
        .find(args.ids.length > 0 && { _id: { $in: [...args.ids.map((id) => ObjectId(id))] } })
        .limit(50)
        .toArray()
        .then((res) => {
          return res;
        });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const port = process.env.PORT || 3000;

require('dotenv').config();
let db;

MongoClient.connect(process.env.MONGO_CONNECTION_STRING, (err, database) => {
  if (err) throw err;
  db = database.db(DB_NAME); // DB connection apollo server context parametresinde yapılacak.
  server.listen(port).then(({ url }) => logger.info(`Server running at ${url} `));
});

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
