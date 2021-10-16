const db = require('../../utils/db');
const tableName = 'user';

module.exports = {

    findAll()
    {
        return db(tableName);
    },

    async findById(id)
    {
        const rows = await db(tableName).where('id',id);
        if(rows.length === 0)
        {
            return null;
        }
        return rows[0];
    },

    async findByMail(mail)
    {
        const rows = await db(tableName).where('Email','like',`${mail}`);
        if(rows.length === 0)
        {
            return null;
        }
        return rows[0];
    },

    async findByUserName(username)
    {
        const rows = await db(tableName).where('Username',username);
        if(rows.length === 0)
        {
            return null;
        }
        return rows[0]; 
    },
    
    add(actor){
        return db(tableName).insert(actor);
    },

    del(id)
    {
        return db(tableName).where('Id',id).del();
    },

    patch(id, user_noId)
    {
        return db(tableName).where('Id', id).update(user_noId);
    },

    async isValidRefeshToken(id, refreshToken){
        const rows = await db(tableName).where('Id',id).andWhere('RefreshToken',refreshToken);
        if(rows.length === 0)
        {
            return false;
        }
        return true;
    }
}