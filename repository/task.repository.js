const logger = require('../logger/api.logger');
const dd = require('../config/db.config');

const getTasks = async () => {
  const tasks = await db.find({});
  console.log('tasks:::', tasks);
  return tasks;
};

const createTask = async (task) => {
  let data = {};
  try {
    console.log('DB', db);
    data = await
  } catch (err) {
    logger.error('Error::' + err);
  }
  return data;
};

const updateTask = async (task) => {
  let data = {};
  try {
    data = await db.updateOne(task);
  } catch (err) {
    logger.error('Error::' + err);
  }
  return data;
};

const deleteTask = async (taskId) => {
  let data = {};
  try {
    data = await db.deleteOne({ _id: taskId });
  } catch (err) {
    logger.error('Error::' + err);
  }
  return { status: `${data.deletedCount > 0}` };
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
