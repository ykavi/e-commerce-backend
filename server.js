const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { ApolloServer, gql } = require('apollo-server');

const logger = require('./logger/api.logger');
const { DB_NAME, COLLECTION } = require('./config/db-config');
const { productSchema } = require('./db-schemas/product-schema');
const { productMapper } = require('./utils/mapper');
const { upperCase } = require('./utils/helper');

const typeDefs = gql`
  scalar Date

  type Query {
    Products(ids: [String]): [Products]
    Categories(ids: [String]): [Categories]
    Orders(ids: [String]): [Orders]
    Coupons(ids: [String]): [Coupons]
  }

  type Mutation {
    AddProduct(inputProduct: ProductInput): Products
    UpdateProduct(_id: String!, inputProduct: ProductInput): Products
    DeleteProduct(_id: String!, inputProduct: ProductInput): Products

    AddCategory(inputCategory: CategoryInput): Categories
    UpdateCategory(_id: String!, inputCategory: CategoryInput): Categories
    DeleteCategory(categoryName: String!, inputCategory: CategoryInput): Categories

    AddOrder(inputOrder: OrderInput): Orders
    UpdateOrder(_id: String!, inputOrder: OrderInput): Orders

    AddCoupon(inputCoupon: CouponInput): Coupons
    UpdateCoupon(_id: String!, inputCoupon: CouponInput): Coupons
    DeleteCoupon(_id: String!): Coupons
  }

  input OrderInput {
    productIds: [String]!
    payment: Int!
    couponId: String
    receiver: ReceiverInput
    status: OrderStatusInput
  }
  input ReceiverInput {
    name: String
    surName: String
    address: String
    phone: String
    mail: String
    country: String
    city: String
    district: String
    note: String
  }
  input OrderStatusInput {
    cargo: Boolean
  }
  input CategoryInput {
    name: String
  }
  input ProductInput {
    title: String
    price: Int!
    discountedPrice: Int
    hasDiscount: Boolean!
    images: [String]
    stock: Int
    description: String
    categoryName: String
    currency: String
    values: [String]
    cargoDetail: CargoDetailInput
  }
  input CargoDetailInput {
    free: Boolean
    price: Int
  }
  input CouponInput {
    code: String!
    codeLimit: Int!
    amount: Int!
    shoppingTotal: Int
    expireDate: Date
  }

  type Categories {
    _id: String
    name: String
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
    categoryName: String
    currency: String
    values: [String]
    cargoDetail: CargoDetail
    createdAt: Date
    updatedAt: Date
  }
  type CargoDetail {
    free: Boolean
    price: Int
  }

  type Orders {
    _id: String
    productIds: [String]
    payment: Int
    couponId: String
    receiver: Receiver
    status: OrderStatus
    createdAt: Date
    updatedAt: Date
  }
  type OrderStatus {
    cargo: Boolean
  }
  type Receiver {
    name: String
    surName: String
    address: String
    phone: String
    mail: String
    country: String
    city: String
    district: String
    note: String
  }

  type Coupons {
    _id: String
    code: String!
    codeLimit: Int
    amount: Int
    shoppingTotal: Int
    expireDate: Date
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
        .then((res) => res)
        .catch((err) => logger.error(err));
    },

    Categories: async (parent, args, context, info) => {
      return await db
        .collection(COLLECTION.CATEGORIES)
        .find(args.ids.length > 0 && { _id: { $in: [...args.ids.map((id) => ObjectId(id))] } })
        .toArray()
        .then((res) => res)
        .catch((err) => logger.error(err));
    },

    Orders: async (parent, args, context, info) => {
      return await db
        .collection(COLLECTION.ORDERS)
        .find(args.ids.length > 0 && { _id: { $in: [...args.ids.map((id) => ObjectId(id))] } })
        .toArray()
        .then((res) => res)
        .catch((err) => logger.error(err));
    },

    Coupons: async (parent, args, context, info) => {
      return await db
        .collection(COLLECTION.COUPONS)
        .find(args.ids.length > 0 && { _id: { $in: [...args.ids.map((id) => ObjectId(id))] } })
        .toArray()
        .then((res) => res)
        .catch((err) => logger.error(err));
    },
  },

  Mutation: {
    AddProduct: async (parent, { inputProduct }, context, info) => {
      const mappedProduct = productMapper(inputProduct);
      if (!mappedProduct) logger.error('mappedProduct error!');

      const result = await db
        .collection(COLLECTION.PRODUCT)
        .insertOne({ ...mappedProduct, createdAt: new Date() })
        .then((res) => res)
        .catch((err) => logger.error(err));

      return (
        result?.insertedId && {
          ...mappedProduct,
          _id: result?.insertedId,
          createdAt: new Date(),
        }
      );
    },

    AddCategory: async (parent, { inputCategory }, context, info) => {
      const upperText = upperCase(inputCategory?.name);

      const checkDublicate = await db
        .collection(COLLECTION.CATEGORIES)
        .findOne({ name: upperText })
        .then((res) => res)
        .catch((err) => logger.error(err));

      if (!checkDublicate) {
        const result = await db
          .collection(COLLECTION.CATEGORIES)
          .insertOne({ name: upperText })
          .then((res) => res)
          .catch((err) => logger.error(err));

        return (
          result?.insertedId && {
            ...inputCategory,
            _id: result?.insertedId,
          }
        );
      }
    },

    AddOrder: async (parent, { inputOrder }, context, info) => {
      if (!inputOrder?.productIds?.length) return false;

      const result = await db
        .collection(COLLECTION.ORDERS)
        .insertOne({ ...inputOrder, createdAt: new Date() })
        .then((res) => res)
        .catch((err) => logger.error(err));

      return (
        result?.insertedId && {
          ...inputOrder,
          _id: result?.insertedId,
        }
      );
    },

    AddCoupon: async (parent, { inputCoupon }, context, info) => {
      const upperCodeName = upperCase(inputCoupon?.code);

      const checkDublicate = await db
        .collection(COLLECTION.COUPONS)
        .findOne({ code: upperCodeName })
        .then((res) => res)
        .catch((err) => logger.error(err));

      if (!checkDublicate) {
        const result = await db
          .collection(COLLECTION.COUPONS)
          .insertOne({ ...inputCoupon, code: upperCodeName, createdAt: new Date() })
          .then((res) => res)
          .catch((err) => logger.error(err));

        return (
          result?.insertedId && {
            ...inputCoupon,
            _id: result?.insertedId,
          }
        );
      }
    },

    UpdateProduct: async (parent, args, context, info) => {
      if (!args?._id) logger.error('UpdateProduct: !args?._id');

      const mappedProduct = productMapper(args?.inputProduct);
      if (!mappedProduct) logger.error('mappedProduct error!');

      const result = await db
        .collection(COLLECTION.PRODUCT)
        .findOneAndUpdate({ _id: ObjectId(args._id) }, { $set: { ...mappedProduct, updatedAt: new Date() } })
        .then((res) => res)
        .catch((err) => logger.error(err));

      return result?.value && result?.value;
    },

    UpdateCategory: async (parent, args, context, info) => {
      if (!args?._id) logger.error('UpdateCategory: !args?._id');

      const upperText = upperCase(args?.inputCategory?.name);

      const result = await db
        .collection(COLLECTION.CATEGORIES)
        .findOneAndUpdate({ _id: ObjectId(args._id) }, { $set: { ...args?.inputCategory, name: upperText } })
        .then((res) => res)
        .catch((err) => logger.error(err));

      return result?.value && result?.value;
    },

    UpdateOrder: async (parent, args, context, info) => {
      if (!args?._id) logger.error('UpdateOrder: !args?._id');
      if (!args?.inputOrder?.productIds.length) return false;

      const result = await db
        .collection(COLLECTION.ORDERS)
        .findOneAndUpdate({ _id: ObjectId(args._id) }, { $set: { ...args?.inputOrder, updatedAt: new Date() } })
        .then((res) => res)
        .catch((err) => logger.error(err));

      return result?.value && result?.value;
    },

    UpdateCoupon: async (parent, args, context, info) => {
      if (!args?._id) logger.error('UpdateOrder: !args?._id');
      const upperCodeName = upperCase(args?.inputCoupon?.code);

      const result = await db
        .collection(COLLECTION.COUPONS)
        .findOneAndUpdate({ _id: ObjectId(args._id) }, { $set: { ...args?.inputCoupon, code: upperCodeName, updatedAt: new Date() } })
        .then((res) => res)
        .catch((err) => logger.error(err));

      return result?.value && result?.value;
    },

    DeleteProduct: async (parent, args, context, info) => {
      if (!args?._id) logger.error('DeleteProduct: !args?._id');

      const result = await db
        .collection(COLLECTION.PRODUCT)
        .findOneAndDelete({ _id: ObjectId(args._id) })
        .then((res) => res)
        .catch((err) => logger.error(err));

      return result?.value && result?.value;
    },

    DeleteCategory: async (parent, args, context, info) => {
      if (!args?.categoryName) logger.error('DeleteCategory: !args?.categoryName');

      const useProductCheck = await db
        .collection(COLLECTION.PRODUCT)
        .findOne({ categoryName: args?.categoryName })
        .then((res) => res)
        .catch((err) => logger.error(err));

      if (!useProductCheck) {
        const result = await db
          .collection(COLLECTION.CATEGORIES)
          .findOneAndDelete({ name: args?.categoryName })
          .then((res) => res)
          .catch((err) => logger.error(err));
        return result?.value && result?.value;
      }
    },

    DeleteCoupon: async (parent, args, context, info) => {
      if (!args?._id) logger.error('DeleteCoupon: !args?._id');

      const result = await db
        .collection(COLLECTION.COUPONS)
        .findOneAndDelete({ _id: ObjectId(args._id) })
        .then((res) => res)
        .catch((err) => logger.error(err));
      return result?.value && result?.value;
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
