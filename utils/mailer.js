var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    }
  });

var defaultMail = {
    from: '',
    text: '',
};

module.exports ={
    // use default setting
    //mail = _.merge({}, defaultMail, mail);
    
    // send email
    send: function(mail)
    {
        transporter.sendMail(mail, function(error, info){
            if(error) return console.log(error);
            console.log('mail sent:', info.response);
        });
    }
   
};