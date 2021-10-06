const express = require('express');
const router = express.Router();
const moment = require('moment');
const passport = require('passport');
const Strategy  = require('passport-facebook').Strategy;
const userModel = require('../../models/user.model');

passport.use(new Strategy({
    clientID: 1202091756958601,
    clientSecret: "392555ed04f135c9a0e81d4f142a223a",
    callbackURL: "http://localhost:4000/user/auth/facebook/callback",
    profileFields: ['id', 'displayName','name', 'photos', 'email', 'birthday']
  },
  async function(accessToken, refreshToken, profile, cb) {
    var user = await accountModel.singleByEmail(`${profile.id}@fb.com`);
    if (!user) {
      const userInfo = profile._json;
      user = {
        id:profile.id,
        Fullname: userInfo.name,
        Email: `${userInfo.id}@fb.com`,
        Birthday: moment(userInfo.birthday, 'MM/DD/YYYY').format('YYYY-MM-DD'),
        Password: '',
        Username: userInfo.displayname
      }
      await userModel.add(user);
    }
  }
));

router.get('/',
  passport.authenticate('facebook', {
    scope: 'email'
  })
);
router.get('/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/user'
  }),(req,res)=>{
    req.session.user = req.user
    res.redirect('/')
  }
);

module.exports=router