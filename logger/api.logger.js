const pine = require('pine');

const logger = pine();

class APILogger {
  info(message, data) {
    data ? logger.info(`${message}   ${data ? JSON.stringify(data) : ''}`) : logger.info(message);
  }

  error(message) {
    logger.error(message);
  }
}

module.exports = new APILogger();
