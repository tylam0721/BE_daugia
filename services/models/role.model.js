const db = require('../../utils/db');
const roleTableName = 'role';
const userTableName = 'user';

module.exports = {
    findAll()
    {
        return db(roleTableName);
    },
    async findById(id)
    {
        const rows = await db(roleTableName).where('id',id);
        if(rows.length === 0)
        {
            return null;
        }
        return rows[0];
    },


    // TODO: move to userModel
    async updateUserRole(userId, newRoleId)
    {
        return await db(userTableName).where('id', userId).update('scope', newRoleId);
    },   
}