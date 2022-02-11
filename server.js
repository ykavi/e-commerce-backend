import { MongoClient } from 'mongodb';
import { ApolloServer } from 'apollo-server';
import { DB_CONFIG } from './config/db-config';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3000;

MongoClient.connect(process.env.MONGO_CONNECTION_STRING, (err, database) => {
  if (err) throw err;

  const db = database.db(DB_CONFIG.DB_NAME);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
      return {
        db: db,
      };
    },
  });

  server.listen(port).then(({ url }) => console.log(`Server running at ${url} `));
});
