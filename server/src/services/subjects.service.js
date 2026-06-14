const subjectsDAL = require('../dal/subjects.dal');

async function getAllActive() {
  return subjectsDAL.findAllActive();
}

async function getAll() {
  return subjectsDAL.findAll();
}

async function create(name, description) {
  return subjectsDAL.create({ name, description });
}

async function setActive(id, is_active) {
  return subjectsDAL.setActive(id, is_active);
}

module.exports = { getAllActive, getAll, create, setActive };
