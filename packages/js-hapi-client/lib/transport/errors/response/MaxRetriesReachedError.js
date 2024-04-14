const ResponseError = require('./ResponseError');

class MaxRetriesReachedError extends ResponseError {
  /**
   * @param {ResponseError} cause
   */
  constructor(cause) {
    super(
      cause.code,
      `Max retries reached: ${cause.message}`,
      cause.getData(),
      cause.getHAPIAddress(),
    );

    this.cause = cause;
  }

  /**
   * @returns {ResponseError}
   */
  getCause() {
    return this.cause;
  }
}

module.exports = MaxRetriesReachedError;
