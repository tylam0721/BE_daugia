const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const refresh_schema = require('../schemas/refresh.json');

const userModel = require('../services/models/user.model');

const validate = require('../middlewares/validate');
const schema = require('../schemas/login.json');
const { json } = require('body-parser');

const config=require('../config/default.json');

const router = express.Router();

router.post('/',validate(schema),async function(req,res){
    const user = await userModel.findByMail(req.body.Email);
    if(user === null)
    {
        return res.status(401).json({
            authenticated: false
        });
    }   

    var validUser = bcrypt.compareSync(req.body.Password, user.Password); 
    if(validUser === false)
    {
        return res.status(401).json({
            authenticated: false
        });
    }
    if(user.IsOTP === 0 || user.IsOTP === null)
    {
        return res.status(401).json({
            authenticated: false
        });
    }
    const payload ={
        userId: user.id,
        email: user.Email,
        scope: user.Scope
    }

    const opts={
        expiresIn: config.accessToken.ExpiredIn * 60 // phút
    }

    const accessToken = jwt.sign(payload,'SECRET_KEY',opts);
    const refreshToken = randomstring.generate(80);
    await userModel.patch(user.id,{
        RefreshToken: refreshToken
    });

    return res.status(200).json({
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
                expiresIn: config.accessToken.ExpiredIn * 60
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