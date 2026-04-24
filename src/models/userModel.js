const { database } = require('./database');

function create({ name, email, password }) {
  const user = {
    id: String(database.counters.users++),
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    password,
    createdAt: new Date().toISOString()
  };

  database.users.push(user);
  return user;
}

function findByEmail(email) {
  return database.users.find((user) => user.email === String(email).trim().toLowerCase()) || null;
}

function findById(id) {
  return database.users.find((user) => user.id === String(id)) || null;
}

module.exports = {
  create,
  findByEmail,
  findById
};
