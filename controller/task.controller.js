const taskService = require('../service/task.service');
const logger = require('../logger/api.logger');

const getTasks = async () => {
  logger.info('Controller: getTasks');
  return await taskService.getTasks();
};

const createTask = async (task) => {
  logger.info('Controller: createTask', task);
  return await taskService.createTask(task);
};

const updateTask = async (task) => {
  logger.info('Controller: updateTask', task);
  return await taskService.updateTask(task);
};

const deleteTask = async (taskId) => {
  logger.info('Controller: deleteTask', taskId);
  return await taskService.deleteTask(taskId);
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
