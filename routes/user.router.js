const express=require('express');
const userModel=require('../services/models/user.model');
const router = express.Router();
const schema = require('../schemas/user.json');
const update_user_info_schema = require('../schemas/update_user_info.json');
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

router.post('/register',validate(schema),async function(req,res){
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
        Xin chào ${req.body.Fullname}, cảm ơn bạn đã tham gia trang web Đấu Giá Online.
        <br> 
        Hãy truy cập vào 
        <a href="https://fedaugia.herokuapp.com/AccountActivation/${OTPCode}"> đây </a> 
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

router.get('/info/:id', async function(req,res){
    if (!req.params.id) {
        return res.json({message: "400 Bad request"}).status(400).end();
    }
    const rows = await userModel.findById(req.params.id);
    if (!rows) {
        return res.json({message: "404 Not found"}).status(404).end();
    }
    res.json(rows).status(200).end();
})

router.get('/info/:id', async function(req,res){
    if (!req.params.id) {
        return res.json({message: "400 Bad request"}).status(400).end();
    }
    const rows = await userModel.findById(req.params.id);
    if (!rows) {
        return res.json({message: "404 Not found"}).status(404).end();
    }
    res.json(rows).status(200).end();
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

router.put('/info/update', validate(update_user_info_schema), async function(req,res){
    const user = await userModel.findById(req.body.Id);
    if (!user) {
        return res.status(404).json({
            message:'User not found',
        });
    }
    const userData = {
        Id: req.body.Id,
        Email: req.body.Email,
        Address: req.body.Address,
        Birthday: moment(req.body.Birthday, 'MM/DD/YYYY').format('YYYY-MM-DD'),
        Firstname: req.body.Firstname,
        Lastname: req.body.Lastname,
    }
    await userModel.update(userData);
    return res.json({message: "User info updated"}).status(200).end();
})

router.get('/profile/:userId',async function(req,res){
    const user = await userModel.findById(req.params.userId);

    return res.json(user).status(200).end();
})
router.use('/auth/facebook', require('./social/facebook'));

module.exports = router;