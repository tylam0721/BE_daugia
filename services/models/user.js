const db = require('../../utils/db');
const tableName = 'user';

module.exports = {
    findAll()
    {
        return db(tableName);
    },
}