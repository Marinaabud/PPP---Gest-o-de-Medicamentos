const { reset } = require('../src/models/database');

exports.mochaHooks = {
  beforeEach() {
    reset();
  }
};
