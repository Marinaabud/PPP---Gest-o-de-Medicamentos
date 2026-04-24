const database = {
  users: [],
  medications: [],
  counters: {
    users: 1,
    medications: 1
  }
};

function reset() {
  database.users = [];
  database.medications = [];
  database.counters = {
    users: 1,
    medications: 1
  };
}

module.exports = {
  database,
  reset
};
