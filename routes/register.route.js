const express=require('express');
const userModel=require('../services/models/user.model');
const router = express.Router();
const schema = require('../schemas/user.json');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const validate = require('../middlewares/validate');
const config=require('../config/default.json');
const randomstring = require('randomstring');
const mailer = require('../utils/mailer');
const { json } = require('body-parser');
require('moment/locale/vi');

router.get('/', async function(req,res){
    const rows = await userModel.findAll();
    res.json(rows);
})

router.post('/create',validate(schema),async function(req,res){
    const user = await userModel.findByMail(req.body.Email);
    if (user != null) {
        return res.status(403).json({
            message:'email is existed',
        });
    }
    else if (req.body.Password != req.body.cf_password) {
        return res.status(403).json({
            message:'confirm password must be valid',
        });
    }
    else {
        const password_hash = bcrypt.hashSync(req.body.Password, config.authentication.saltRounds);
        const user ={
            
            Email: req.body.Email,
            Password: password_hash,
            Birthday: moment(req.body.Birthday, 'MM/DD/YYYY').format('YYYY-MM-DD'),
            Firstname: req.body.Firstname,
            Lastname: req.body.Lastname,
            RateGood: 0,
            RateBad: 0,
            IsOTP: 0,
            Isdeleted: 0,
            DateCreated: new Date(Date.now())
        }
        const affectedRows = await userModel.add(user);
        if(affectedRows === 0){
            return res.status(401).json({
                message:'error when create new user',
            });
        }
    };

    const OTPCode = randomstring.generate(12);
    mailer.send({
        from: 'webdaugiaonline@gmail.com',
        to: `${req.body.Email}`,
        subject: 'Web Đấu Giá Online: Xác thực tài khoản của bạn.',
        html: `
        Xin chào ${req.body.Lastname}, cảm ơn bạn đã tham gia trang web Đấu Giá Online.
        <br> 
        Hãy truy cập vào 
        <a href="https://localhost:3000/accountActivation/${OTPCode}"> đây </a> 
        để xác thực email và kích hoạt tài khoản đã đăng ký của bạn.
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

router.put('/update-password/:id', async function(req,res){
    const userId = req.params.id;
    const newPassword = req.body.NewPassword;
    const oldPassword = req.body.OldPassword;

    if (!userId || !newPassword || !oldPassword) {
        return res.json({message: "400 Bad request"}).status(400).end();
    }

    var user = await userModel.findById(userId);
    if (!await bcrypt.compare(oldPassword, user.Password)) {
        return res.json({message: "Password's not correct"}).status(400).end();
    }

    var newHashPassword = bcrypt.hashSync(newPassword, config.authentication.saltRounds);
    const rows = await userModel.updatePassword(userId, newHashPassword);
    if (!rows) {
        return res.json({message: "Something went wrong"}).status(404).end();
    }
    res.json({"message": "Password update successfully!"}).status(200).end();
})


router.use('/auth/facebook', require('./social/facebook'));

module.exports = router;