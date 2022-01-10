const taskRepository = require('../repository/task.repository');

const getTasks = async () => {
  return await taskRepository.getTasks();
};

const createTask = async (task) => {
  return await taskRepository.createTask(task);
};

const updateTask = async (task) => {
  return await taskRepository.updateTask(task);
};

const deleteTask = async (taskId) => {
  return await taskRepository.deleteTask(taskId);
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
