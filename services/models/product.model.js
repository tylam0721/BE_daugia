const db = require("../../utils/db");
const tableName = "product";

module.exports = {
  findAll() {
    return db(tableName).where("Isdeleted", 0);
  },
  findbyCategory(id) {
    return db(tableName).where("Isdeleted", 0).andWhere("IdCategory", id);
  },
  add(product) {
    return db(tableName).insert(product);
  },
  update(product, id) {
    return db(tableName).where("id", id).update(product);
  },
  delete(id) {
    return db(tableName).where("id", id).update("Isdeleted", 1);
  },
};
