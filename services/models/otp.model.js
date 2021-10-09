const db = require('../../utils/db');
const tableName = 'otp';



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

    async findByOTP(OTP)
    {
        const rows = await db(tableName).where('OTP','like',`${OTP}`);
        if(rows.length === 0)
        {
            return null;
        }
        return rows[0];
    },

    async findByUserId(id)
    {
        const rows = await db(tableName).where('UserId',id);
        if(rows.length === 0)
        {
            return null;
        }
        return rows[0]; 
    },
    
    add(otp){
        return db(tableName).insert(otp);
    },

    del(id)
    {
        return db(tableName).where('Id',id).del();
    },

    patch(id, otpNoId)
    {
        return db(tableName).where('Id', id).update(otpNoId);
    },
}