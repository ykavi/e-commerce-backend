const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger/api.logger');
const { DB_NAME, COLLECTION } = require('./config/db-config');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();
app.use(bodyParser.json());
let db;

MongoClient.connect(process.env.MONGO_CONNECTION_STRING, (err, database) => {
  if (err) throw err;
  db = database.db(DB_NAME);
  app.listen(port, () => {
    logger.info(`Node.js app is listening at http://localhost:${port}`);
  });
});

app.get('/api/tasks', (req, res) => {
  db.collection(COLLECTION)
    .find({})
    .limit(50)
    .toArray((err, result) => {
      if (err) res.status(400).send('Error fetching listings!');

      res.json(result);
    });
});

app.post('/api/task', (req, res) => {
  console.log(req.body, 'dd');
  taskController.createTask(req.body.task).then((data) => res.json(data));
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
