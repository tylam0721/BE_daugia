const db = require("../../utils/db");
const tableName = "auction";

module.exports = {
  findAll() {
    return db(tableName).where("Isdeleted", 0);
  },
  add(auction) {
    return db(tableName).insert(auction);
  },
  delete(id) {
    return db(tableName).where("id", id).update("Isdeleted", 1);
  },
  update(id, data) {
    return db(tableName).where("id", id).update(data);
  },
};
