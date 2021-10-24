const db = require("../../utils/db");
const tableName = "category";

module.exports = {
  findAll() {
    return db(tableName).where("Isdeleted", 0);
  },
  add(category) {
    return db(tableName).insert(category);
  },
  delete(id) {
    return db(tableName).where("id", id).update("Isdeleted", 1);
  },
  update(id, data) {
    return db(tableName).where("id", id).update(data);
  },
};
