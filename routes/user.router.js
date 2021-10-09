const express=require('express');
const userModel=require('../models/user.model');
const router = express.Router();
const schema = require('../schemas/user.json');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const validate = require('../middlewares/validate');
const config=require('../config/default.json');
const randomstring = require('randomstring');

router.get('/', async function(req,res){
    const rows = await userModel.findAll();
    res.json(rows);
})

router.post('/register',validate(schema),async function(req,res){
    const user = await userModel.findByMail(req.body.email);
    if (user) {
        return res.json({
            message:'email is existed',
        });
    }
    else if (req.body.password != req.body.cf_password) {
        return res.json({
            message:'confirm password must be valid',
        });
    }
    else {
        const password_hash = bcrypt.hashSync(req.body.Password, config.authentication.saltRounds);
        const user ={
            Fullname: req.body.Fullname,
            Email: req.body.Email,
            Password: password_hash,
            Birthday: moment(req.body.Birthday, 'MM/DD/YYYY').format('YYYY-MM-DD'),
            Username: req.body.Username
        }
        const affectedRows = await userModel.add(user);
        if(affectedRows === 0){
            return res.json({
                message:'error when create new user',
            });
        }
    };

    const OTP = randomstring.generate(12);
    mailer.send({
        from: 'webdaugiaonline@gmail.com',
        to: `${req.body.Email}`,
        subject: 'Web Đấu Giá Online: Xác thực tài khoản của bạn.',
        html: `
        Xin chào ${req.body.Fullname}, cảm ơn bạn đã tham gia trang web Đấu Giá Online.
        <br> 
        Hãy nhấp vào 
        <a href="https://fedaugia.herokuapp.com/AccountActivation/${OTP}"> đây </a> 
        để xác minh email và kích hoạt tài khoản của bạn.
        <br>
        (Đây là thư tự động vui lòng không phản hồi)
        `
    });

    res.status(201).json(
        {
            message:"Register successfull"
        }
    );
})

router.use('/auth/facebook', require('./social/facebook'));

module.exports = router;