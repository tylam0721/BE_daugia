const express=require('express');
const otpModel =require('../services/models/otp.model');
const router = express.Router();
const schema = require('../schemas/otp.json');
const moment = require('moment');
const validate = require('../middlewares/validate');
const randomstring = require('randomstring');
const mailer = require('../utils/mailer');


router.post('/resend',validate(schema),async function(req,res){
    const queryOTP = await otpModel.findByEmail(req.body.Email);
    if(queryOTP != null)
    {
        //update record
    }
    const otp ={
        Email: req.body.Email,
        OTP: randomstring.generate(12),
        DateCreated: new Date(Date.now()),

    }


});

router.post('/confirm',async function(req,res){

});

module.exports = router;