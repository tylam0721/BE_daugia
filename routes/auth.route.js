const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    }

    const opts={
        expiresIn: 30 * 60 // seconds
    }

    const accessToken = jwt.sign(payload,'SECRET_KEY',opts);



    return json({
        authenticated: true,
        accessToken,
        refreshToken: 'refreshToken',
    });

});



module.exports = router;