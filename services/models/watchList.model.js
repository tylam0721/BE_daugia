const db = require("../../utils/db");
const tableName = "watch_list";

module.exports = {
    findAll() {
        return db(tableName);
    },
    findbyCategory(id) {
        return db(tableName).where("Isdeleted", 0).andWhere("IdCategory", id);
    },
    add(object) {
        return db(tableName).insert(object);
    },
    update(object, id) {
        return db(tableName).where("id", id).update(object);
    },
    delete(id) {
        return db(tableName).where("id", id).update("Isdeleted", 1);
    },
}