const express=require('express');
const otpModel =require('../services/models/otp.model');
const router = express.Router();
const schemaResend = require('../schemas/OTP_Resend.json');
const schemaConfirm = require('../schemas/OTP_Confirm.json');
const moment = require('moment');
const validate = require('../middlewares/validate');
const randomstring = require('randomstring');
const mailer = require('../utils/mailer');
const userModel = require('../services/models/user.model');
require('moment/locale/vi');

router.post('/resend',validate(schemaResend),async function(req,res){
    const queryOTP = await otpModel.findByEmail(req.body.Email);
    if(queryOTP != null)
    {
        const otp ={
            Email: queryOTP.Email,
            OTP: randomstring.generate(12),
            DateCreated: new Date(Date.now()),
            ResendTime: 0,
        }
        //update record
        if(queryOTP.ResendTime < 3)
        {
            otp.ResendTime = queryOTP.ResendTime + 1;
            otpModel.patch(queryOTP.id,otp)
            return res.status("200").json({message :"OTP resend successfully."});
        }
        else{
            var days = moment().diff(moment(queryOTP.DateCreated).format(),'days');
            if(days == 0)
            {
                return res.status("203").json({message :"Resend times of this account is at limit"});
            }
            else if(days > 0)
            {
                otp.ResendTime = 1;
                otpModel.patch(queryOTP.id,otp)
                return res.status("200").json({message :"OTP resend successfully."});
            }
        }
    }
    else{
        return res.status("203").json({message :"No email found"});
    }
});

router.post('/confirm',validate(schemaConfirm), async function(req,res){
    const queryOTP = await otpModel.findByOTP(req.body.OTP);
    if(queryOTP === null)
    {
        return res.status(204).json({message: "OTP not found"});
    }
    const user = await userModel.findByMail(queryOTP.Email);
    if(user === null)
    {
        return res.status(204).json({message: "User email not found"});
    }
    user.isOTP = 1;
    const id = user.id;
    delete(user.id);
    await user.patch(id,user);
    return res.status(200).json("User activated successfully");
});

module.exports = router;