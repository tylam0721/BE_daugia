const db = require('../../utils/db');
const tableName = 'add_description';

module.exports = {
    findAll()
    {
        return db(tableName).where('Isdeleted', 0);
    },
    add(des) {
        return db(tableName).insert(des);
    },
    delete(id){
        return db(tableName).where('id', id).update('Isdeleted', 1);
    },

    updateIsCheckReturn(id){
        return db(tableName).where('IdProduct', id).update('IsCheckReturn', 1);
    }
}   