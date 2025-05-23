const ClientError = require("./ClientError");

class InvariantError extends ClientError {
  constructor(message) {
    super(message);
  }
}

module.exports = InvariantError;
