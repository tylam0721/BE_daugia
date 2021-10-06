const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const refresh_schema = require('../schemas/refresh.json');


const userModel = require('../models/user.model');

const validate = require('../middlewares/validate');
const schema = require('../schemas/login.json');
const { json } = require('body-parser');

const router = express.Router();

router.post('/',validate(schema),async function(req,res){
    const user = await userModel.findByUserName(req.body.username);
    if(user === null)
    {
        return res.status(401).json({
            authenticated: false
        });
    }   
    const rawPassword = req.body.password;
    const hashedPassword = user.Password;
    if(bcrypt.compareSync(rawPassword,hashedPassword))
    {
        return res.status(401).json({
            authenticated: false
        });
    }

    const payload ={
        userId: user.id,
        scope: user.Scope
    }

    const opts={
        expiresIn: 30 * 60 // 30 phút
    }

    const accessToken = jwt.sign(payload,'SECRET_KEY',opts);
    const refreshToken = randomstring.generate(80);
    await userModel.patch(user.id,{
        RefreshToken: refreshToken
    });

    return json({
        authenticated: true,
        accessToken,
        refreshToken
    });

});


router.post('/refresh', validate(refresh_schema), async function(req,res){
    const {accessToken, refreshToken} = req.body;

    try{
        const {userId} = jwt.verify(accessToken,'SECRET_KEY',{
            ignoreExpiration: true
        });

        const ret = await userModel.isValidRefreshToken(userId,refreshToken);

        if(ret === true)
        {
            const payload = {userId}
            const opts = {
                expiresIn: 10 * 60
            }
            const newAccessToken = jwt.sign(payload,'SECRET_KEY',opts);
            return res.json({
                accessToken: newAccessToken
            });
        }
        return res.status(401).json({message: 'Invalid refresh token'});

    }
    catch(err){
        return res.status(401).json({message: 'Invalid access token'});
    }

});

module.exports = router;